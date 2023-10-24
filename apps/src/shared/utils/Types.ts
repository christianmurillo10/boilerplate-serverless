export type GenericObject = Record<string, string> | object;

export type GenericArray = any[];

export type UniqueId = number | string | null;

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type Permissions = "CREATE" | "UPDATE" | "DELETE" | "READ" | "CHANGE_PASSWORD";

export type ChangePassword = {
  old_password: string,
  new_password: string,
};

export type Query = {
  filters?: GenericObject,
  sorting?: GenericObject,
  offset?: number,
  limit?: number
};

export type FindAllArgs = {
  condition?: GenericObject | undefined,
  query?: Query | undefined,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type FindAllBetweenCreatedAtArgs = {
  date_from?: string | undefined,
  date_to?: string | undefined,
  condition?: GenericObject | undefined,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type FindByIdArgs<I> = {
  id: I,
  condition?: GenericObject | undefined,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type FindByNameArgs = {
  name: string,
  condition?: GenericObject | undefined,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type FindByApiKeyArgs = {
  api_key: string,
  condition?: GenericObject | undefined,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type FindByEmailArgs = {
  email: string,
  condition?: GenericObject | undefined,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type FindByUsernameOrEmailArgs = {
  username: string,
  email: string,
  condition?: GenericObject | undefined,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type CreateArgs<P> = {
  params: P,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type CreateManyArgs<P> = {
  params: P[]
};

export type UpdateArgs<I, P> = {
  id: I,
  params: P,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type SoftDeleteArgs<I> = {
  id: I,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type DeleteArgs<I> = {
  id: I
};

export type SoftDeleteManyArgs<I> = {
  ids: I[]
};

export type ChangePasswordArgs<I> = {
  id: I,
  new_password: string
};

export type CountArgs = {
  condition?: GenericObject | undefined,
  query?: Query | undefined
};