import { PrismaClient } from "@prisma/client";
import RbacModules from "../../entities/RbacModules";
import { parseQueryFilters, setSelectExclude } from "../../helpers";
import {
  GenericObject,
  FindAllArgs,
  FindByIdArgs,
  FindByNameArgs,
  CreateArgs,
  UpdateArgs,
  SoftDeleteArgs,
  SoftDeleteManyArgs,
  CountArgs
} from "../../utils/Types";
import { rbacModulesSubsets } from "../../helpers/selectSubsets";

interface RbacModulesRepositoryInterface {
  findAll: (args: FindAllArgs) => Promise<RbacModules[]>;

  findById: (args: FindByIdArgs<number>) => Promise<RbacModules | null>;

  findByName: (args: FindByNameArgs) => Promise<RbacModules | null>;

  create: (args: CreateArgs<RbacModules>) => Promise<RbacModules>;

  update: (args: UpdateArgs<number, RbacModules>) => Promise<RbacModules>;

  softDelete: (args: SoftDeleteArgs<number>) => Promise<RbacModules>;

  softDeleteMany: (args: SoftDeleteManyArgs<number>) => Promise<GenericObject>;

  count: (args?: CountArgs) => Promise<number>;
};

export default class RbacModulesRepository implements RbacModulesRepositoryInterface {
  private client;

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.rbac_modules;
  };

  findAll = async (
    args: FindAllArgs
  ): Promise<RbacModules[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const parentSelect = args.include?.includes("parent")
      ? { parent: { select: { ...rbacModulesSubsets, deleted_at: false } } }
      : undefined;
    const res = await this.client.findMany({
      select: {
        ...rbacModulesSubsets,
        ...exclude,
        ...parentSelect
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

    return res.map(item => new RbacModules(item));
  };

  findById = async (
    args: FindByIdArgs<number>
  ): Promise<RbacModules | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const parentSelect = args.include?.includes("parent")
      ? { parent: { select: { ...rbacModulesSubsets, deleted_at: false } } }
      : undefined;
    const res = await this.client.findFirst({
      select: {
        ...rbacModulesSubsets,
        ...exclude,
        ...parentSelect
      },
      where: {
        id: args.id,
        deleted_at: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new RbacModules(res);
  };

  findByName = async (
    args: FindByNameArgs
  ): Promise<RbacModules | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const parentSelect = args.include?.includes("parent")
      ? { parent: { select: { ...rbacModulesSubsets, deleted_at: false } } }
      : undefined;
    const res = await this.client.findFirst({
      select: {
        ...rbacModulesSubsets,
        ...exclude,
        ...parentSelect
      },
      where: {
        name: args.name,
        deleted_at: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new RbacModules(res);
  };

  create = async (
    args: CreateArgs<RbacModules>
  ): Promise<RbacModules> => {
    const exclude = setSelectExclude(args.exclude!);
    const parentSelect = args.include?.includes("parent")
      ? { parent: { select: { ...rbacModulesSubsets, deleted_at: false } } }
      : undefined;
    const data = await this.client.create({
      select: {
        ...rbacModulesSubsets,
        ...exclude,
        ...parentSelect
      },
      data: args.params
    });

    return new RbacModules(data);
  };

  update = async (
    args: UpdateArgs<number, RbacModules>
  ): Promise<RbacModules> => {
    const exclude = setSelectExclude(args.exclude!);
    const parentSelect = args.include?.includes("parent")
      ? { parent: { select: { ...rbacModulesSubsets, deleted_at: false } } }
      : undefined;
    const data = await this.client.update({
      select: {
        ...rbacModulesSubsets,
        ...exclude,
        ...parentSelect
      },
      where: { id: args.id },
      data: {
        ...args.params,
        updated_at: new Date(),
      }
    });

    return new RbacModules(data);
  };

  softDelete = async (
    args: SoftDeleteArgs<number>
  ): Promise<RbacModules> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...rbacModulesSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        deleted_at: new Date(),
      }
    });

    return new RbacModules(data);
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