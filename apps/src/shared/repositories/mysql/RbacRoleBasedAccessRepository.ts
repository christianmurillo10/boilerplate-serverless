import { PrismaClient } from "@prisma/client";
import RbacRoleBasedAccess from "../../entities/RbacRoleBasedAccess";
import { parseQueryFilters, setSelectExclude } from "../../helpers";
import {
  GenericObject,
  FindAllArgs,
  FindByIdArgs,
  CreateArgs,
  CreateManyArgs,
  UpdateArgs,
  SoftDeleteArgs,
  SoftDeleteManyArgs,
  DeleteArgs,
  CountArgs
} from "../../utils/Types";
import {
  rbacModulesSubsets,
  rbacRoleBasedAccessSubsets,
  rolesSubsets,
  usersSubsets
} from "../../helpers/selectSubsets";

interface RbacRoleBasedAccessRepositoryInterface {
  findAll: (args: FindAllArgs) => Promise<RbacRoleBasedAccess[]>;

  findById: (args: FindByIdArgs<number>) => Promise<RbacRoleBasedAccess | null>;

  create: (args: CreateArgs<RbacRoleBasedAccess>) => Promise<RbacRoleBasedAccess>;

  createMany: (args: CreateManyArgs<RbacRoleBasedAccess>) => Promise<void>;

  update: (args: UpdateArgs<number, RbacRoleBasedAccess>) => Promise<RbacRoleBasedAccess>;

  softDelete: (args: SoftDeleteArgs<number>, deleted_user_id: string) => Promise<RbacRoleBasedAccess>;

  softDeleteMany: (args: SoftDeleteManyArgs<number>) => Promise<GenericObject>;

  delete: (args: DeleteArgs<number>) => Promise<void>;

  count: (args?: CountArgs) => Promise<number>;
};

export default class RbacRoleBasedAccessRepository implements RbacRoleBasedAccessRepositoryInterface {
  private client;

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.rbac_role_based_access;
  };

  findAll = async (
    args: FindAllArgs
  ): Promise<RbacRoleBasedAccess[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const rbacModulesSelect = args.include?.includes("rbac_modules")
      ? { rbac_modules: { select: { ...rbacModulesSubsets, deleted_at: false } } }
      : undefined;
    const rolesSelect = args.include?.includes("roles")
      ? { roles: { select: { ...rolesSubsets, deleted_at: false } } }
      : undefined;
    const usersSelect = args.include?.includes("users")
      ? { users: { select: { ...usersSubsets, deleted_at: false } } }
      : undefined;
    const res = await this.client.findMany({
      select: {
        ...rbacRoleBasedAccessSubsets,
        ...exclude,
        ...rbacModulesSelect,
        ...rolesSelect,
        ...usersSelect
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

    return res.map(item => new RbacRoleBasedAccess(item));
  };

  findById = async (
    args: FindByIdArgs<number>
  ): Promise<RbacRoleBasedAccess | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const rbacModulesSelect = args.include?.includes("rbac_modules")
      ? { rbac_modules: { select: { ...rbacModulesSubsets, deleted_at: false } } }
      : undefined;
    const rolesSelect = args.include?.includes("roles")
      ? { roles: { select: { ...rolesSubsets, deleted_at: false } } }
      : undefined;
    const usersSelect = args.include?.includes("users")
      ? { users: { select: { ...usersSubsets, deleted_at: false } } }
      : undefined;
    const res = await this.client.findFirst({
      select: {
        ...rbacRoleBasedAccessSubsets,
        ...exclude,
        ...rbacModulesSelect,
        ...rolesSelect,
        ...usersSelect
      },
      where: {
        id: args.id,
        deleted_at: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new RbacRoleBasedAccess(res);
  };

  create = async (
    args: CreateArgs<RbacRoleBasedAccess>
  ): Promise<RbacRoleBasedAccess> => {
    const exclude = setSelectExclude(args.exclude!);
    const rbacModulesSelect = args.include?.includes("rbac_modules")
      ? { rbac_modules: { select: { ...rbacModulesSubsets, deleted_at: false } } }
      : undefined;
    const rolesSelect = args.include?.includes("roles")
      ? { roles: { select: { ...rolesSubsets, deleted_at: false } } }
      : undefined;
    const usersSelect = args.include?.includes("users")
      ? { users: { select: { ...usersSubsets, deleted_at: false } } }
      : undefined;
    const data = await this.client.create({
      select: {
        ...rbacRoleBasedAccessSubsets,
        ...exclude,
        ...rbacModulesSelect,
        ...rolesSelect,
        ...usersSelect
      },
      data: args.params
    });

    return new RbacRoleBasedAccess(data);
  };

  createMany = async (
    args: CreateManyArgs<RbacRoleBasedAccess>,
  ): Promise<void> => {
    await this.client.createMany({
      data: args.params
    });
  };

  update = async (
    args: UpdateArgs<number, RbacRoleBasedAccess>
  ): Promise<RbacRoleBasedAccess> => {
    const exclude = setSelectExclude(args.exclude!);
    const rbacModulesSelect = args.include?.includes("rbac_modules")
      ? { rbac_modules: { select: { ...rbacModulesSubsets, deleted_at: false } } }
      : undefined;
    const rolesSelect = args.include?.includes("roles")
      ? { roles: { select: { ...rolesSubsets, deleted_at: false } } }
      : undefined;
    const usersSelect = args.include?.includes("users")
      ? { users: { select: { ...usersSubsets, deleted_at: false } } }
      : undefined;
    const data = await this.client.update({
      select: {
        ...rbacRoleBasedAccessSubsets,
        ...exclude,
        ...rbacModulesSelect,
        ...rolesSelect,
        ...usersSelect
      },
      where: { id: args.id },
      data: {
        ...args.params,
        updated_at: new Date(),
      }
    });

    return new RbacRoleBasedAccess(data);
  };

  softDelete = async (
    args: SoftDeleteArgs<number>,
    deleted_user_id: string,
  ): Promise<RbacRoleBasedAccess> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...rbacRoleBasedAccessSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        deleted_at: new Date(),
        deleted_user_id: deleted_user_id,
      }
    });

    return new RbacRoleBasedAccess(data);
  };

  softDeleteMany = async (
    args: SoftDeleteManyArgs<number>
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

  delete = async (
    args: DeleteArgs<number>
  ): Promise<void> => {
    await this.client.delete({
      where: { id: args.id }
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