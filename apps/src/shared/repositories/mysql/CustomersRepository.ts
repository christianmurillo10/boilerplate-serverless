import { PrismaClient } from "@prisma/client";
import Customers, { CustomerStatus } from "../../entities/Customers";
import { generateNonce, parseQueryFilters, setSelectExclude } from "../../helpers";
import {
  GenericObject,
  Gender,
  FindAllArgs,
  FindAllBetweenCreatedAtArgs,
  FindByIdArgs,
  FindByEmailArgs,
  CreateArgs,
  UpdateArgs,
  SoftDeleteArgs,
  SoftDeleteManyArgs,
  ChangePasswordArgs,
  CountArgs
} from "../../utils/Types";
import { hashPassword } from "../../utils/Bcrypt";
import { CUSTOMER_STATUS_APPROVED } from "../../helpers/constant";
import { customersSubsets } from "../../helpers/selectSubsets";

interface CustomersRepositoryInterface {
  findAll: (args: FindAllArgs) => Promise<Customers[]>;

  findAllBetweenCreatedAt: (args: FindAllBetweenCreatedAtArgs) => Promise<Customers[]>;

  findById: (args: FindByIdArgs<string>) => Promise<Customers | null>;

  findByEmail: (args: FindByEmailArgs) => Promise<Customers | null>;

  create: (args: CreateArgs<Customers>) => Promise<Customers>;

  update: (args: UpdateArgs<string, Customers>) => Promise<Customers>;

  softDelete: (args: SoftDeleteArgs<string>) => Promise<Customers>;

  softDeleteMany: (args: SoftDeleteManyArgs<string>) => Promise<GenericObject>;

  changePassword: (args: ChangePasswordArgs<string>) => Promise<void>;

  count: (args?: CountArgs) => Promise<number>;
};

export default class CustomersRepository implements CustomersRepositoryInterface {
  private client;

  readonly imagePath = "public/images/customers/";

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.customers;
  };

  findAll = async (
    args: FindAllArgs
  ): Promise<Customers[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findMany({
      select: {
        ...customersSubsets,
        ...exclude,
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

    return res.map(item => new Customers({
      ...item,
      gender_type: item.gender_type as Gender,
      status: item.status as CustomerStatus
    }));
  };

  findAllBetweenCreatedAt = async (
    args: FindAllBetweenCreatedAtArgs
  ): Promise<Customers[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const betweenCreatedAt = args.date_from && args.date_to
      ? { created_at: { gte: new Date(args.date_from), lte: new Date(args.date_to) } }
      : undefined;
    const res = await this.client.findMany({
      select: {
        ...customersSubsets,
        ...exclude,
      },
      where: {
        ...args.condition,
        ...betweenCreatedAt,
      }
    });

    return res.map(item => new Customers({
      ...item,
      gender_type: item.gender_type as Gender,
      status: item.status as CustomerStatus
    }));
  };

  findById = async (
    args: FindByIdArgs<string>
  ): Promise<Customers | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...customersSubsets,
        ...exclude,
      },
      where: {
        id: args.id,
        deleted_at: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new Customers({
      ...res,
      gender_type: res.gender_type as Gender,
      status: res.status as CustomerStatus
    });
  };

  findByEmail = async (
    args: FindByEmailArgs
  ): Promise<Customers | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...customersSubsets,
        ...exclude,
      },
      where: {
        email: args.email,
        deleted_at: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new Customers({
      ...res,
      gender_type: res.gender_type as Gender,
      status: res.status as CustomerStatus
    });
  };

  create = async (
    args: CreateArgs<Customers>
  ): Promise<Customers> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...customersSubsets,
        ...exclude,
      },
      data: {
        ...args.params,
        password: hashPassword(args.params.password as string)
      }
    });

    return new Customers({
      ...data,
      verified_at: args.params.verified_at ? new Date(args.params.verified_at) : null,
      customer_no: args.params.status === CUSTOMER_STATUS_APPROVED && !args.params.customer_no ? "CST" + generateNonce() : null,
      gender_type: data.gender_type as Gender,
      status: data.status as CustomerStatus
    });
  };

  update = async (
    args: UpdateArgs<string, Customers>
  ): Promise<Customers> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...customersSubsets,
        ...exclude,
      },
      where: { id: args.id },
      data: {
        ...args.params,
        password: args.params.password as string,
        updated_at: new Date(),
        customer_no: args.params.status === CUSTOMER_STATUS_APPROVED && !args.params.customer_no ? "CST" + generateNonce() : null,
        verified_at: args.params.verified_at ? new Date(args.params.verified_at) : null
      }
    });

    return new Customers({
      ...data,
      gender_type: data.gender_type as Gender,
      status: data.status as CustomerStatus
    });
  };

  softDelete = async (
    args: SoftDeleteArgs<string>
  ): Promise<Customers> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...customersSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        deleted_at: new Date(),
      }
    });

    return new Customers({
      ...data,
      gender_type: data.gender_type as Gender,
      status: data.status as CustomerStatus
    });
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