import { PrismaClient } from "@prisma/client";
import Users from "../../entities/Users";
import { parseQueryFilters, setSelectExclude } from "../../helpers";
import {
  GenericObject,
  FindAllArgs,
  FindAllBetweenCreatedAtArgs,
  FindByIdArgs,
  FindByUsernameOrEmailArgs,
  CreateArgs,
  UpdateArgs,
  SoftDeleteArgs,
  SoftDeleteManyArgs,
  ChangePasswordArgs,
  CountArgs
} from "../../utils/Types";
import { hashPassword } from "../../utils/Bcrypt";
import { usersSubsets, rolesSubsets } from "../../helpers/selectSubsets";

interface UsersRepositoryInterface {
  findAll: (args: FindAllArgs) => Promise<Users[]>;

  findAllBetweenCreatedAt: (args: FindAllBetweenCreatedAtArgs) => Promise<Users[]>;

  findById: (args: FindByIdArgs<string>) => Promise<Users | null>;

  findByUsernameOrEmail: (args: FindByUsernameOrEmailArgs) => Promise<Users | null>;

  create: (args: CreateArgs<Users>) => Promise<Users>;

  update: (args: UpdateArgs<string, Users>) => Promise<Users>;

  softDelete: (args: SoftDeleteArgs<string>) => Promise<Users>;

  softDeleteMany: (args: SoftDeleteManyArgs<string>) => Promise<GenericObject>;

  changePassword: (args: ChangePasswordArgs<string>) => Promise<void>;

  count: (args?: CountArgs) => Promise<number>;
};

export default class UsersRepository implements UsersRepositoryInterface {
  private client;

  readonly imagePath = "public/images/users/";

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.users;
  };

  findAll = async (
    args: FindAllArgs
  ): Promise<Users[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const rolesSelect = args.include?.includes("roles")
      ? { roles: { select: { ...rolesSubsets, deleted_at: false } } }
      : undefined;
    const res = await this.client.findMany({
      select: {
        ...usersSubsets,
        ...exclude,
        ...rolesSelect,
      },
      where: {
        deleted_at: null,
        ...args.condition,
        ...parseQueryFilters(args.query?.filters)
      },
      orderBy: {
        ...args.query?.sorting
      },
      skip: args.query?.offset,
      take: args.query?.limit
    });

    return res.map(item => new Users(item));
  };

  findAllBetweenCreatedAt = async (
    args: FindAllBetweenCreatedAtArgs
  ): Promise<Users[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const rolesSelect = args.include?.includes("roles")
      ? { roles: { select: { ...rolesSubsets, deleted_at: false } } }
      : undefined;
    const betweenCreatedAt = args.date_from && args.date_to
      ? { created_at: { gte: new Date(args.date_from), lte: new Date(args.date_to) } }
      : undefined;
    const res = await this.client.findMany({
      select: {
        ...usersSubsets,
        ...exclude,
        ...rolesSelect,
      },
      where: {
        ...args.condition,
        ...betweenCreatedAt,
      }
    });

    return res.map(item => new Users(item));
  };

  findById = async (
    args: FindByIdArgs<string>
  ): Promise<Users | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const rolesSelect = args.include?.includes("roles")
      ? { roles: { select: { ...rolesSubsets, deleted_at: false } } }
      : undefined;
    const res = await this.client.findFirst({
      select: {
        ...usersSubsets,
        ...exclude,
        ...rolesSelect,
      },
      where: {
        id: args.id,
        deleted_at: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new Users(res);
  };

  findByUsernameOrEmail = async (
    args: FindByUsernameOrEmailArgs
  ): Promise<Users | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const rolesSelect = args.include?.includes("roles")
      ? { roles: { select: { ...rolesSubsets, deleted_at: false } } }
      : undefined;
    const res = await this.client.findFirst({
      select: {
        ...usersSubsets,
        ...exclude,
        ...rolesSelect,
      },
      where: {
        OR: [
          {
            username: {
              equals: args.username,
            },
          },
          {
            email: {
              equals: args.email,
            },
          },
        ],
        deleted_at: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new Users(res);
  };

  create = async (
    args: CreateArgs<Users>
  ): Promise<Users> => {
    const exclude = setSelectExclude(args.exclude!);
    const rolesSelect = args.include?.includes("roles")
      ? { roles: { select: { ...rolesSubsets, deleted_at: false } } }
      : undefined;
    const data = await this.client.create({
      select: {
        ...usersSubsets,
        ...exclude,
        ...rolesSelect,
      },
      data: {
        ...args.params,
        password: hashPassword(args.params.password as string)
      }
    });

    return new Users(data);
  };

  update = async (
    args: UpdateArgs<string, Users>
  ): Promise<Users> => {
    const exclude = setSelectExclude(args.exclude!);
    const rolesSelect = args.include?.includes("roles")
      ? { roles: { select: { ...rolesSubsets, deleted_at: false } } }
      : undefined;
    const data = await this.client.update({
      select: {
        ...usersSubsets,
        ...exclude,
        ...rolesSelect,
      },
      where: { id: args.id },
      data: {
        ...args.params,
        password: args.params.password as string,
        updated_at: new Date(),
      }
    });

    return new Users(data);
  };

  softDelete = async (
    args: SoftDeleteArgs<string>
  ): Promise<Users> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...usersSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        deleted_at: new Date(),
      }
    });

    return new Users(data);
  };

  softDeleteMany = async (
    args: SoftDeleteManyArgs<string>
  ): Promise<GenericObject> => {
    const data = await this.client.updateMany({
      where: {
        id: {
          in: args.ids
        }
      },
      data: {
        deleted_at: new Date(),
      }
    });

    return data;
  };

  changePassword = async (
    args: ChangePasswordArgs<string>
  ): Promise<void> => {
    await this.client.update({
      where: { id: args.id },
      data: {
        password: hashPassword(args.new_password),
        updated_at: new Date(),
      }
    });
  };

  count = async (
    args?: CountArgs
  ): Promise<number> => {
    const data = this.client.count({
      where: {
        deleted_at: null,
        ...args?.condition,
        ...parseQueryFilters(args?.query?.filters)
      }
    });

    return data;
  };
};