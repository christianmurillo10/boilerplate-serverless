import { PrismaClient } from "@prisma/client";
import AuditTrails, { Action, TableName } from "../../entities/AuditTrails";
import { parseQueryFilters, setSelectExclude } from "../../helpers";
import {
  GenericObject,
  FindAllArgs,
  FindAllBetweenCreatedAtArgs,
  FindByIdArgs,
  CreateArgs,
  DeleteArgs,
  CountArgs
} from "../../utils/Types";
import { auditTrailsSubsets, usersSubsets } from "../../helpers/selectSubsets";

interface AuditTrailsRepositoryInterface {
  findAll: (args: FindAllArgs) => Promise<AuditTrails[]>;

  findAllBetweenCreatedAt: (args: FindAllBetweenCreatedAtArgs) => Promise<AuditTrails[]>;

  findById: (args: FindByIdArgs<string>) => Promise<AuditTrails | null>;

  create: (args: CreateArgs<AuditTrails>) => Promise<AuditTrails>;

  delete: (args: DeleteArgs<string>) => Promise<void>;

  count: (args?: CountArgs) => Promise<number>;
};

export default class AuditTrailsRepository implements AuditTrailsRepositoryInterface {
  private client;

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.audit_trails;
  };

  findAll = async (
    args: FindAllArgs
  ): Promise<AuditTrails[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const createdUsersSelect = args.include?.includes("created_users")
      ? { created_users: { select: { ...usersSubsets, deleted_at: false, last_login_at: false, password: false, is_logged: false } } }
      : undefined;
    const res = await this.client.findMany({
      select: {
        ...auditTrailsSubsets,
        ...exclude,
        ...createdUsersSelect
      },
      where: {
        ...args.condition,
        ...parseQueryFilters(args.query?.filters)
      },
      orderBy: {
        ...args.query?.sorting
      },
      skip: args.query?.offset,
      take: args.query?.limit
    });

    return res.map(item => new AuditTrails({
      ...item,
      table_name: item.table_name as TableName,
      action: item.action as Action,
      old_values: item.old_values as GenericObject,
      new_values: item.new_values as GenericObject
    }));
  };

  findAllBetweenCreatedAt = async (
    args: FindAllBetweenCreatedAtArgs
  ): Promise<AuditTrails[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const createdUsersSelect = args.include?.includes("created_users")
      ? { created_users: { select: { ...usersSubsets, deleted_at: false, last_login_at: false, password: false, is_logged: false } } }
      : undefined;
    const betweenCreatedAt = args.date_from && args.date_to
      ? { created_at: { gte: new Date(args.date_from), lte: new Date(args.date_to) } }
      : undefined;
    const res = await this.client.findMany({
      select: {
        ...auditTrailsSubsets,
        ...exclude,
        ...createdUsersSelect
      },
      where: {
        ...args.condition,
        ...betweenCreatedAt,
      }
    });

    return res.map(item => new AuditTrails({
      ...item,
      table_name: item.table_name as TableName,
      action: item.action as Action,
      old_values: item.old_values as GenericObject,
      new_values: item.new_values as GenericObject
    }));
  };

  findById = async (
    args: FindByIdArgs<string>
  ): Promise<AuditTrails | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const createdUsersSelect = args.include?.includes("created_users")
      ? { created_users: { select: { ...usersSubsets, deleted_at: false, last_login_at: false, password: false, is_logged: false } } }
      : undefined;
    const res = await this.client.findFirst({
      select: {
        ...auditTrailsSubsets,
        ...exclude,
        ...createdUsersSelect
      },
      where: {
        id: args.id,
        ...args.condition
      }
    });

    if (!res) return null;

    return new AuditTrails({
      ...res,
      table_name: res.table_name as TableName,
      action: res.action as Action,
      old_values: res.old_values as GenericObject,
      new_values: res.new_values as GenericObject
    });
  };

  create = async (
    args: CreateArgs<AuditTrails>
  ): Promise<AuditTrails> => {
    const exclude = setSelectExclude(args.exclude!);
    const createdUsersSelect = args.include?.includes("created_users")
      ? { created_users: { select: { ...usersSubsets, deleted_at: false, last_login_at: false, password: false, is_logged: false } } }
      : undefined;
    const data = await this.client.create({
      select: {
        ...auditTrailsSubsets,
        ...exclude,
        ...createdUsersSelect
      },
      data: args.params
    });

    return new AuditTrails({
      ...data,
      table_name: data.table_name as TableName,
      action: data.action as Action,
      old_values: data.old_values as GenericObject,
      new_values: data.new_values as GenericObject
    });
  };

  delete = async (
    args: DeleteArgs<string>
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
        ...args?.condition,
        ...parseQueryFilters(args?.query?.filters)
      }
    });

    return data;
  };
};