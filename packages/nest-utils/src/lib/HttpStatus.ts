export class HttpStatus {
  public static readonly OK = 200 as const
  public static readonly CREATED = 201 as const
  public static readonly NO_CONTENT = 204 as const
  public static readonly BAD_REQUEST = 400 as const
  public static readonly UNAUTHORIZED = 401 as const
  public static readonly FORBIDDEN = 403 as const
  public static readonly NO_FOUND = 404 as const
  public static readonly INTERNAL_SERVER_ERROR = 500 as const
}
