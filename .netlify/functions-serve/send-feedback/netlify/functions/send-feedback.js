var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/@notionhq/client/build/src/utils.js
var require_utils = __commonJS({
  "node_modules/@notionhq/client/build/src/utils.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isObject = exports2.pick = exports2.assertNever = void 0;
    function assertNever(value) {
      throw new Error(`Unexpected value should never occur: ${value}`);
    }
    exports2.assertNever = assertNever;
    function pick(base, keys) {
      const entries = keys.map((key) => [key, base === null || base === void 0 ? void 0 : base[key]]);
      return Object.fromEntries(entries);
    }
    exports2.pick = pick;
    function isObject(o) {
      return typeof o === "object" && o !== null;
    }
    exports2.isObject = isObject;
  }
});

// node_modules/@notionhq/client/build/src/logging.js
var require_logging = __commonJS({
  "node_modules/@notionhq/client/build/src/logging.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.logLevelSeverity = exports2.makeConsoleLogger = exports2.LogLevel = void 0;
    var utils_1 = require_utils();
    var LogLevel;
    (function(LogLevel2) {
      LogLevel2["DEBUG"] = "debug";
      LogLevel2["INFO"] = "info";
      LogLevel2["WARN"] = "warn";
      LogLevel2["ERROR"] = "error";
    })(LogLevel = exports2.LogLevel || (exports2.LogLevel = {}));
    function makeConsoleLogger(name) {
      return (level, message, extraInfo) => {
        console[level](`${name} ${level}:`, message, extraInfo);
      };
    }
    exports2.makeConsoleLogger = makeConsoleLogger;
    function logLevelSeverity(level) {
      switch (level) {
        case LogLevel.DEBUG:
          return 20;
        case LogLevel.INFO:
          return 40;
        case LogLevel.WARN:
          return 60;
        case LogLevel.ERROR:
          return 80;
        default:
          return (0, utils_1.assertNever)(level);
      }
    }
    exports2.logLevelSeverity = logLevelSeverity;
  }
});

// node_modules/@notionhq/client/build/src/errors.js
var require_errors = __commonJS({
  "node_modules/@notionhq/client/build/src/errors.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.buildRequestError = exports2.APIResponseError = exports2.UnknownHTTPResponseError = exports2.isHTTPResponseError = exports2.RequestTimeoutError = exports2.isNotionClientError = exports2.ClientErrorCode = exports2.APIErrorCode = void 0;
    var utils_1 = require_utils();
    var APIErrorCode;
    (function(APIErrorCode2) {
      APIErrorCode2["Unauthorized"] = "unauthorized";
      APIErrorCode2["RestrictedResource"] = "restricted_resource";
      APIErrorCode2["ObjectNotFound"] = "object_not_found";
      APIErrorCode2["RateLimited"] = "rate_limited";
      APIErrorCode2["InvalidJSON"] = "invalid_json";
      APIErrorCode2["InvalidRequestURL"] = "invalid_request_url";
      APIErrorCode2["InvalidRequest"] = "invalid_request";
      APIErrorCode2["ValidationError"] = "validation_error";
      APIErrorCode2["ConflictError"] = "conflict_error";
      APIErrorCode2["InternalServerError"] = "internal_server_error";
      APIErrorCode2["ServiceUnavailable"] = "service_unavailable";
    })(APIErrorCode = exports2.APIErrorCode || (exports2.APIErrorCode = {}));
    var ClientErrorCode;
    (function(ClientErrorCode2) {
      ClientErrorCode2["RequestTimeout"] = "notionhq_client_request_timeout";
      ClientErrorCode2["ResponseError"] = "notionhq_client_response_error";
    })(ClientErrorCode = exports2.ClientErrorCode || (exports2.ClientErrorCode = {}));
    var NotionClientErrorBase = class extends Error {
    };
    function isNotionClientError(error) {
      return (0, utils_1.isObject)(error) && error instanceof NotionClientErrorBase;
    }
    exports2.isNotionClientError = isNotionClientError;
    function isNotionClientErrorWithCode(error, codes) {
      return isNotionClientError(error) && error.code in codes;
    }
    var RequestTimeoutError = class _RequestTimeoutError extends NotionClientErrorBase {
      constructor(message = "Request to Notion API has timed out") {
        super(message);
        this.code = ClientErrorCode.RequestTimeout;
        this.name = "RequestTimeoutError";
      }
      static isRequestTimeoutError(error) {
        return isNotionClientErrorWithCode(error, {
          [ClientErrorCode.RequestTimeout]: true
        });
      }
      static rejectAfterTimeout(promise, timeoutMS) {
        return new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new _RequestTimeoutError());
          }, timeoutMS);
          promise.then(resolve).catch(reject).then(() => clearTimeout(timeoutId));
        });
      }
    };
    exports2.RequestTimeoutError = RequestTimeoutError;
    var HTTPResponseError = class extends NotionClientErrorBase {
      constructor(args) {
        super(args.message);
        this.name = "HTTPResponseError";
        const { code, status, headers, rawBodyText } = args;
        this.code = code;
        this.status = status;
        this.headers = headers;
        this.body = rawBodyText;
      }
    };
    var httpResponseErrorCodes = {
      [ClientErrorCode.ResponseError]: true,
      [APIErrorCode.Unauthorized]: true,
      [APIErrorCode.RestrictedResource]: true,
      [APIErrorCode.ObjectNotFound]: true,
      [APIErrorCode.RateLimited]: true,
      [APIErrorCode.InvalidJSON]: true,
      [APIErrorCode.InvalidRequestURL]: true,
      [APIErrorCode.InvalidRequest]: true,
      [APIErrorCode.ValidationError]: true,
      [APIErrorCode.ConflictError]: true,
      [APIErrorCode.InternalServerError]: true,
      [APIErrorCode.ServiceUnavailable]: true
    };
    function isHTTPResponseError(error) {
      if (!isNotionClientErrorWithCode(error, httpResponseErrorCodes)) {
        return false;
      }
      return true;
    }
    exports2.isHTTPResponseError = isHTTPResponseError;
    var UnknownHTTPResponseError = class extends HTTPResponseError {
      constructor(args) {
        var _a;
        super({
          ...args,
          code: ClientErrorCode.ResponseError,
          message: (_a = args.message) !== null && _a !== void 0 ? _a : `Request to Notion API failed with status: ${args.status}`
        });
        this.name = "UnknownHTTPResponseError";
      }
      static isUnknownHTTPResponseError(error) {
        return isNotionClientErrorWithCode(error, {
          [ClientErrorCode.ResponseError]: true
        });
      }
    };
    exports2.UnknownHTTPResponseError = UnknownHTTPResponseError;
    var apiErrorCodes = {
      [APIErrorCode.Unauthorized]: true,
      [APIErrorCode.RestrictedResource]: true,
      [APIErrorCode.ObjectNotFound]: true,
      [APIErrorCode.RateLimited]: true,
      [APIErrorCode.InvalidJSON]: true,
      [APIErrorCode.InvalidRequestURL]: true,
      [APIErrorCode.InvalidRequest]: true,
      [APIErrorCode.ValidationError]: true,
      [APIErrorCode.ConflictError]: true,
      [APIErrorCode.InternalServerError]: true,
      [APIErrorCode.ServiceUnavailable]: true
    };
    var APIResponseError = class extends HTTPResponseError {
      constructor() {
        super(...arguments);
        this.name = "APIResponseError";
      }
      static isAPIResponseError(error) {
        return isNotionClientErrorWithCode(error, apiErrorCodes);
      }
    };
    exports2.APIResponseError = APIResponseError;
    function buildRequestError(response, bodyText) {
      const apiErrorResponseBody = parseAPIErrorResponseBody(bodyText);
      if (apiErrorResponseBody !== void 0) {
        return new APIResponseError({
          code: apiErrorResponseBody.code,
          message: apiErrorResponseBody.message,
          headers: response.headers,
          status: response.status,
          rawBodyText: bodyText
        });
      }
      return new UnknownHTTPResponseError({
        message: void 0,
        headers: response.headers,
        status: response.status,
        rawBodyText: bodyText
      });
    }
    exports2.buildRequestError = buildRequestError;
    function parseAPIErrorResponseBody(body) {
      if (typeof body !== "string") {
        return;
      }
      let parsed;
      try {
        parsed = JSON.parse(body);
      } catch (parseError) {
        return;
      }
      if (!(0, utils_1.isObject)(parsed) || typeof parsed["message"] !== "string" || !isAPIErrorCode(parsed["code"])) {
        return;
      }
      return {
        ...parsed,
        code: parsed["code"],
        message: parsed["message"]
      };
    }
    function isAPIErrorCode(code) {
      return typeof code === "string" && code in apiErrorCodes;
    }
  }
});

// node_modules/@notionhq/client/build/src/api-endpoints.js
var require_api_endpoints = __commonJS({
  "node_modules/@notionhq/client/build/src/api-endpoints.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.oauthIntrospect = exports2.oauthRevoke = exports2.oauthToken = exports2.getFileUpload = exports2.completeFileUpload = exports2.sendFileUpload = exports2.listFileUploads = exports2.createFileUpload = exports2.listComments = exports2.createComment = exports2.search = exports2.createDatabase = exports2.listDatabases = exports2.queryDatabase = exports2.updateDatabase = exports2.getDatabase = exports2.appendBlockChildren = exports2.listBlockChildren = exports2.deleteBlock = exports2.updateBlock = exports2.getBlock = exports2.getPageProperty = exports2.updatePage = exports2.getPage = exports2.createPage = exports2.listUsers = exports2.getUser = exports2.getSelf = void 0;
    exports2.getSelf = {
      method: "get",
      pathParams: [],
      queryParams: [],
      bodyParams: [],
      path: () => `users/me`
    };
    exports2.getUser = {
      method: "get",
      pathParams: ["user_id"],
      queryParams: [],
      bodyParams: [],
      path: (p) => `users/${p.user_id}`
    };
    exports2.listUsers = {
      method: "get",
      pathParams: [],
      queryParams: ["start_cursor", "page_size"],
      bodyParams: [],
      path: () => `users`
    };
    exports2.createPage = {
      method: "post",
      pathParams: [],
      queryParams: [],
      bodyParams: ["parent", "properties", "icon", "cover", "content", "children"],
      path: () => `pages`
    };
    exports2.getPage = {
      method: "get",
      pathParams: ["page_id"],
      queryParams: ["filter_properties"],
      bodyParams: [],
      path: (p) => `pages/${p.page_id}`
    };
    exports2.updatePage = {
      method: "patch",
      pathParams: ["page_id"],
      queryParams: [],
      bodyParams: ["properties", "icon", "cover", "archived", "in_trash"],
      path: (p) => `pages/${p.page_id}`
    };
    exports2.getPageProperty = {
      method: "get",
      pathParams: ["page_id", "property_id"],
      queryParams: ["start_cursor", "page_size"],
      bodyParams: [],
      path: (p) => `pages/${p.page_id}/properties/${p.property_id}`
    };
    exports2.getBlock = {
      method: "get",
      pathParams: ["block_id"],
      queryParams: [],
      bodyParams: [],
      path: (p) => `blocks/${p.block_id}`
    };
    exports2.updateBlock = {
      method: "patch",
      pathParams: ["block_id"],
      queryParams: [],
      bodyParams: [
        "embed",
        "type",
        "archived",
        "in_trash",
        "bookmark",
        "image",
        "video",
        "pdf",
        "file",
        "audio",
        "code",
        "equation",
        "divider",
        "breadcrumb",
        "table_of_contents",
        "link_to_page",
        "table_row",
        "heading_1",
        "heading_2",
        "heading_3",
        "paragraph",
        "bulleted_list_item",
        "numbered_list_item",
        "quote",
        "to_do",
        "toggle",
        "template",
        "callout",
        "synced_block",
        "table",
        "column"
      ],
      path: (p) => `blocks/${p.block_id}`
    };
    exports2.deleteBlock = {
      method: "delete",
      pathParams: ["block_id"],
      queryParams: [],
      bodyParams: [],
      path: (p) => `blocks/${p.block_id}`
    };
    exports2.listBlockChildren = {
      method: "get",
      pathParams: ["block_id"],
      queryParams: ["start_cursor", "page_size"],
      bodyParams: [],
      path: (p) => `blocks/${p.block_id}/children`
    };
    exports2.appendBlockChildren = {
      method: "patch",
      pathParams: ["block_id"],
      queryParams: [],
      bodyParams: ["children", "after"],
      path: (p) => `blocks/${p.block_id}/children`
    };
    exports2.getDatabase = {
      method: "get",
      pathParams: ["database_id"],
      queryParams: [],
      bodyParams: [],
      path: (p) => `databases/${p.database_id}`
    };
    exports2.updateDatabase = {
      method: "patch",
      pathParams: ["database_id"],
      queryParams: [],
      bodyParams: [
        "title",
        "description",
        "icon",
        "cover",
        "properties",
        "is_inline",
        "archived",
        "in_trash"
      ],
      path: (p) => `databases/${p.database_id}`
    };
    exports2.queryDatabase = {
      method: "post",
      pathParams: ["database_id"],
      queryParams: ["filter_properties"],
      bodyParams: [
        "sorts",
        "filter",
        "start_cursor",
        "page_size",
        "archived",
        "in_trash"
      ],
      path: (p) => `databases/${p.database_id}/query`
    };
    exports2.listDatabases = {
      method: "get",
      pathParams: [],
      queryParams: ["start_cursor", "page_size"],
      bodyParams: [],
      path: () => `databases`
    };
    exports2.createDatabase = {
      method: "post",
      pathParams: [],
      queryParams: [],
      bodyParams: [
        "parent",
        "properties",
        "icon",
        "cover",
        "title",
        "description",
        "is_inline"
      ],
      path: () => `databases`
    };
    exports2.search = {
      method: "post",
      pathParams: [],
      queryParams: [],
      bodyParams: ["sort", "query", "start_cursor", "page_size", "filter"],
      path: () => `search`
    };
    exports2.createComment = {
      method: "post",
      pathParams: [],
      queryParams: [],
      bodyParams: ["parent", "rich_text", "discussion_id"],
      path: () => `comments`
    };
    exports2.listComments = {
      method: "get",
      pathParams: [],
      queryParams: ["block_id", "start_cursor", "page_size"],
      bodyParams: [],
      path: () => `comments`
    };
    exports2.createFileUpload = {
      method: "post",
      pathParams: [],
      queryParams: [],
      bodyParams: [
        "mode",
        "filename",
        "content_type",
        "number_of_parts",
        "external_url"
      ],
      path: () => `file_uploads`
    };
    exports2.listFileUploads = {
      method: "get",
      pathParams: [],
      queryParams: ["status", "start_cursor", "page_size"],
      bodyParams: [],
      path: () => `file_uploads`
    };
    exports2.sendFileUpload = {
      method: "post",
      pathParams: ["file_upload_id"],
      queryParams: [],
      bodyParams: [],
      formDataParams: ["file", "part_number"],
      path: (p) => `file_uploads/${p.file_upload_id}/send`
    };
    exports2.completeFileUpload = {
      method: "post",
      pathParams: ["file_upload_id"],
      queryParams: [],
      bodyParams: [],
      path: (p) => `file_uploads/${p.file_upload_id}/complete`
    };
    exports2.getFileUpload = {
      method: "get",
      pathParams: ["file_upload_id"],
      queryParams: [],
      bodyParams: [],
      path: (p) => `file_uploads/${p.file_upload_id}`
    };
    exports2.oauthToken = {
      method: "post",
      pathParams: [],
      queryParams: [],
      bodyParams: ["grant_type", "code", "redirect_uri", "external_account"],
      path: () => `oauth/token`
    };
    exports2.oauthRevoke = {
      method: "post",
      pathParams: [],
      queryParams: [],
      bodyParams: ["token"],
      path: () => `oauth/revoke`
    };
    exports2.oauthIntrospect = {
      method: "post",
      pathParams: [],
      queryParams: [],
      bodyParams: ["token"],
      path: () => `oauth/introspect`
    };
  }
});

// node_modules/@notionhq/client/build/package.json
var require_package = __commonJS({
  "node_modules/@notionhq/client/build/package.json"(exports2, module2) {
    module2.exports = {
      name: "@notionhq/client",
      version: "3.1.3",
      description: "A simple and easy to use client for the Notion API",
      engines: {
        node: ">=18"
      },
      homepage: "https://developers.notion.com/docs/getting-started",
      bugs: {
        url: "https://github.com/makenotion/notion-sdk-js/issues"
      },
      repository: {
        type: "git",
        url: "https://github.com/makenotion/notion-sdk-js/"
      },
      keywords: [
        "notion",
        "notionapi",
        "rest",
        "notion-api"
      ],
      main: "./build/src",
      types: "./build/src/index.d.ts",
      scripts: {
        prepare: "npm run build",
        prepublishOnly: "npm run checkLoggedIn && npm run lint && npm run test",
        build: "tsc",
        prettier: "prettier --write .",
        lint: "prettier --check . && eslint . --ext .ts && cspell '**/*' ",
        test: "jest ./test",
        "check-links": "git ls-files | grep md$ | xargs -n 1 markdown-link-check",
        prebuild: "npm run clean",
        clean: "rm -rf ./build",
        checkLoggedIn: "./scripts/verifyLoggedIn.sh"
      },
      author: "",
      license: "MIT",
      files: [
        "build/package.json",
        "build/src/**"
      ],
      devDependencies: {
        "@types/jest": "^28.1.4",
        "@typescript-eslint/eslint-plugin": "^5.39.0",
        "@typescript-eslint/parser": "^5.39.0",
        cspell: "^5.4.1",
        eslint: "^7.24.0",
        jest: "^28.1.2",
        "markdown-link-check": "^3.8.7",
        prettier: "^2.8.8",
        "ts-jest": "^28.0.5",
        typescript: "^4.8.4"
      }
    };
  }
});

// node_modules/@notionhq/client/build/src/Client.js
var require_Client = __commonJS({
  "node_modules/@notionhq/client/build/src/Client.js"(exports2) {
    "use strict";
    var __classPrivateFieldSet = exports2 && exports2.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
      if (kind === "m") throw new TypeError("Private method is not writable");
      if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    };
    var __classPrivateFieldGet = exports2 && exports2.__classPrivateFieldGet || function(receiver, state, kind, f) {
      if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    var _Client_auth;
    var _Client_logLevel;
    var _Client_logger;
    var _Client_prefixUrl;
    var _Client_timeoutMs;
    var _Client_notionVersion;
    var _Client_fetch;
    var _Client_agent;
    var _Client_userAgent;
    Object.defineProperty(exports2, "__esModule", { value: true });
    var logging_1 = require_logging();
    var errors_1 = require_errors();
    var utils_1 = require_utils();
    var api_endpoints_1 = require_api_endpoints();
    var package_json_1 = require_package();
    var Client2 = class _Client {
      constructor(options) {
        var _a, _b, _c, _d, _e, _f;
        _Client_auth.set(this, void 0);
        _Client_logLevel.set(this, void 0);
        _Client_logger.set(this, void 0);
        _Client_prefixUrl.set(this, void 0);
        _Client_timeoutMs.set(this, void 0);
        _Client_notionVersion.set(this, void 0);
        _Client_fetch.set(this, void 0);
        _Client_agent.set(this, void 0);
        _Client_userAgent.set(this, void 0);
        this.blocks = {
          /**
           * Retrieve block
           */
          retrieve: (args) => {
            return this.request({
              path: api_endpoints_1.getBlock.path(args),
              method: api_endpoints_1.getBlock.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.getBlock.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.getBlock.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          },
          /**
           * Update block
           */
          update: (args) => {
            return this.request({
              path: api_endpoints_1.updateBlock.path(args),
              method: api_endpoints_1.updateBlock.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.updateBlock.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.updateBlock.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          },
          /**
           * Delete block
           */
          delete: (args) => {
            return this.request({
              path: api_endpoints_1.deleteBlock.path(args),
              method: api_endpoints_1.deleteBlock.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.deleteBlock.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.deleteBlock.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          },
          children: {
            /**
             * Append block children
             */
            append: (args) => {
              return this.request({
                path: api_endpoints_1.appendBlockChildren.path(args),
                method: api_endpoints_1.appendBlockChildren.method,
                query: (0, utils_1.pick)(args, api_endpoints_1.appendBlockChildren.queryParams),
                body: (0, utils_1.pick)(args, api_endpoints_1.appendBlockChildren.bodyParams),
                auth: args === null || args === void 0 ? void 0 : args.auth
              });
            },
            /**
             * Retrieve block children
             */
            list: (args) => {
              return this.request({
                path: api_endpoints_1.listBlockChildren.path(args),
                method: api_endpoints_1.listBlockChildren.method,
                query: (0, utils_1.pick)(args, api_endpoints_1.listBlockChildren.queryParams),
                body: (0, utils_1.pick)(args, api_endpoints_1.listBlockChildren.bodyParams),
                auth: args === null || args === void 0 ? void 0 : args.auth
              });
            }
          }
        };
        this.databases = {
          /**
           * List databases
           *
           * @deprecated Please use `search`
           */
          list: (args) => {
            return this.request({
              path: api_endpoints_1.listDatabases.path(),
              method: api_endpoints_1.listDatabases.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.listDatabases.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.listDatabases.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          },
          /**
           * Retrieve a database
           */
          retrieve: (args) => {
            return this.request({
              path: api_endpoints_1.getDatabase.path(args),
              method: api_endpoints_1.getDatabase.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.getDatabase.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.getDatabase.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          },
          /**
           * Query a database
           */
          query: (args) => {
            return this.request({
              path: api_endpoints_1.queryDatabase.path(args),
              method: api_endpoints_1.queryDatabase.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.queryDatabase.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.queryDatabase.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          },
          /**
           * Create a database
           */
          create: (args) => {
            return this.request({
              path: api_endpoints_1.createDatabase.path(),
              method: api_endpoints_1.createDatabase.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.createDatabase.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.createDatabase.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          },
          /**
           * Update a database
           */
          update: (args) => {
            return this.request({
              path: api_endpoints_1.updateDatabase.path(args),
              method: api_endpoints_1.updateDatabase.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.updateDatabase.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.updateDatabase.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          }
        };
        this.pages = {
          /**
           * Create a page
           */
          create: (args) => {
            return this.request({
              path: api_endpoints_1.createPage.path(),
              method: api_endpoints_1.createPage.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.createPage.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.createPage.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          },
          /**
           * Retrieve a page
           */
          retrieve: (args) => {
            return this.request({
              path: api_endpoints_1.getPage.path(args),
              method: api_endpoints_1.getPage.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.getPage.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.getPage.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          },
          /**
           * Update page properties
           */
          update: (args) => {
            return this.request({
              path: api_endpoints_1.updatePage.path(args),
              method: api_endpoints_1.updatePage.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.updatePage.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.updatePage.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          },
          properties: {
            /**
             * Retrieve page property
             */
            retrieve: (args) => {
              return this.request({
                path: api_endpoints_1.getPageProperty.path(args),
                method: api_endpoints_1.getPageProperty.method,
                query: (0, utils_1.pick)(args, api_endpoints_1.getPageProperty.queryParams),
                body: (0, utils_1.pick)(args, api_endpoints_1.getPageProperty.bodyParams),
                auth: args === null || args === void 0 ? void 0 : args.auth
              });
            }
          }
        };
        this.users = {
          /**
           * Retrieve a user
           */
          retrieve: (args) => {
            return this.request({
              path: api_endpoints_1.getUser.path(args),
              method: api_endpoints_1.getUser.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.getUser.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.getUser.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          },
          /**
           * List all users
           */
          list: (args) => {
            return this.request({
              path: api_endpoints_1.listUsers.path(),
              method: api_endpoints_1.listUsers.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.listUsers.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.listUsers.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          },
          /**
           * Get details about bot
           */
          me: (args) => {
            return this.request({
              path: api_endpoints_1.getSelf.path(),
              method: api_endpoints_1.getSelf.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.getSelf.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.getSelf.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          }
        };
        this.comments = {
          /**
           * Create a comment
           */
          create: (args) => {
            return this.request({
              path: api_endpoints_1.createComment.path(),
              method: api_endpoints_1.createComment.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.createComment.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.createComment.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          },
          /**
           * List comments
           */
          list: (args) => {
            return this.request({
              path: api_endpoints_1.listComments.path(),
              method: api_endpoints_1.listComments.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.listComments.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.listComments.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          }
        };
        this.fileUploads = {
          /**
           * Create a file upload
           */
          create: (args) => {
            return this.request({
              path: api_endpoints_1.createFileUpload.path(),
              method: api_endpoints_1.createFileUpload.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.createFileUpload.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.createFileUpload.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          },
          /**
           * Retrieve a file upload
           */
          retrieve: (args) => {
            return this.request({
              path: api_endpoints_1.getFileUpload.path(args),
              method: api_endpoints_1.getFileUpload.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.getFileUpload.queryParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          },
          /**
           * List file uploads
           */
          list: (args) => {
            return this.request({
              path: api_endpoints_1.listFileUploads.path(),
              method: api_endpoints_1.listFileUploads.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.listFileUploads.queryParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          },
          /**
           * Send a file upload
           *
           * Requires a `file_upload_id`, obtained from the `id` of the Create File
           * Upload API response.
           *
           * The `file` parameter contains the raw file contents or Blob/File object
           * under `file.data`, and an optional `file.filename` string.
           *
           * Supply a stringified `part_number` parameter when using file uploads
           * in multi-part mode.
           *
           * This endpoint sends HTTP multipart/form-data instead of JSON parameters.
           */
          send: (args) => {
            return this.request({
              path: api_endpoints_1.sendFileUpload.path(args),
              method: api_endpoints_1.sendFileUpload.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.sendFileUpload.queryParams),
              formDataParams: (0, utils_1.pick)(args, api_endpoints_1.sendFileUpload.formDataParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          },
          /**
           * Complete a file upload
           */
          complete: (args) => {
            return this.request({
              path: api_endpoints_1.completeFileUpload.path(args),
              method: api_endpoints_1.completeFileUpload.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.completeFileUpload.queryParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          }
        };
        this.search = (args) => {
          return this.request({
            path: api_endpoints_1.search.path(),
            method: api_endpoints_1.search.method,
            query: (0, utils_1.pick)(args, api_endpoints_1.search.queryParams),
            body: (0, utils_1.pick)(args, api_endpoints_1.search.bodyParams),
            auth: args === null || args === void 0 ? void 0 : args.auth
          });
        };
        this.oauth = {
          /**
           * Get token
           */
          token: (args) => {
            return this.request({
              path: api_endpoints_1.oauthToken.path(),
              method: api_endpoints_1.oauthToken.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.oauthToken.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.oauthToken.bodyParams),
              auth: {
                client_id: args.client_id,
                client_secret: args.client_secret
              }
            });
          },
          /**
           * Introspect token
           */
          introspect: (args) => {
            return this.request({
              path: api_endpoints_1.oauthIntrospect.path(),
              method: api_endpoints_1.oauthIntrospect.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.oauthIntrospect.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.oauthIntrospect.bodyParams),
              auth: {
                client_id: args.client_id,
                client_secret: args.client_secret
              }
            });
          },
          /**
           * Revoke token
           */
          revoke: (args) => {
            return this.request({
              path: api_endpoints_1.oauthRevoke.path(),
              method: api_endpoints_1.oauthRevoke.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.oauthRevoke.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.oauthRevoke.bodyParams),
              auth: {
                client_id: args.client_id,
                client_secret: args.client_secret
              }
            });
          }
        };
        __classPrivateFieldSet(this, _Client_auth, options === null || options === void 0 ? void 0 : options.auth, "f");
        __classPrivateFieldSet(this, _Client_logLevel, (_a = options === null || options === void 0 ? void 0 : options.logLevel) !== null && _a !== void 0 ? _a : logging_1.LogLevel.WARN, "f");
        __classPrivateFieldSet(this, _Client_logger, (_b = options === null || options === void 0 ? void 0 : options.logger) !== null && _b !== void 0 ? _b : (0, logging_1.makeConsoleLogger)(package_json_1.name), "f");
        __classPrivateFieldSet(this, _Client_prefixUrl, `${(_c = options === null || options === void 0 ? void 0 : options.baseUrl) !== null && _c !== void 0 ? _c : "https://api.notion.com"}/v1/`, "f");
        __classPrivateFieldSet(this, _Client_timeoutMs, (_d = options === null || options === void 0 ? void 0 : options.timeoutMs) !== null && _d !== void 0 ? _d : 6e4, "f");
        __classPrivateFieldSet(this, _Client_notionVersion, (_e = options === null || options === void 0 ? void 0 : options.notionVersion) !== null && _e !== void 0 ? _e : _Client.defaultNotionVersion, "f");
        __classPrivateFieldSet(this, _Client_fetch, (_f = options === null || options === void 0 ? void 0 : options.fetch) !== null && _f !== void 0 ? _f : fetch, "f");
        __classPrivateFieldSet(this, _Client_agent, options === null || options === void 0 ? void 0 : options.agent, "f");
        __classPrivateFieldSet(this, _Client_userAgent, `notionhq-client/${package_json_1.version}`, "f");
      }
      /**
       * Sends a request.
       */
      async request(args) {
        const { path, method, query, body, formDataParams, auth } = args;
        this.log(logging_1.LogLevel.INFO, "request start", { method, path });
        const bodyAsJsonString = !body || Object.entries(body).length === 0 ? void 0 : JSON.stringify(body);
        const url = new URL(`${__classPrivateFieldGet(this, _Client_prefixUrl, "f")}${path}`);
        if (query) {
          for (const [key, value] of Object.entries(query)) {
            if (value !== void 0) {
              if (Array.isArray(value)) {
                for (const val of value) {
                  url.searchParams.append(key, decodeURIComponent(val));
                }
              } else {
                url.searchParams.append(key, String(value));
              }
            }
          }
        }
        let authorizationHeader;
        if (typeof auth === "object") {
          const unencodedCredential = `${auth.client_id}:${auth.client_secret}`;
          const encodedCredential = Buffer.from(unencodedCredential).toString("base64");
          authorizationHeader = { authorization: `Basic ${encodedCredential}` };
        } else {
          authorizationHeader = this.authAsHeaders(auth);
        }
        const headers = {
          ...authorizationHeader,
          "Notion-Version": __classPrivateFieldGet(this, _Client_notionVersion, "f"),
          "user-agent": __classPrivateFieldGet(this, _Client_userAgent, "f")
        };
        if (bodyAsJsonString !== void 0) {
          headers["content-type"] = "application/json";
        }
        let formData;
        if (formDataParams) {
          delete headers["content-type"];
          formData = new FormData();
          for (const [key, value] of Object.entries(formDataParams)) {
            if (typeof value === "string") {
              formData.append(key, value);
            } else if (typeof value === "object") {
              formData.append(key, typeof value.data === "object" ? value.data : new Blob([value.data]), value.filename);
            }
          }
        }
        try {
          const response = await errors_1.RequestTimeoutError.rejectAfterTimeout(__classPrivateFieldGet(this, _Client_fetch, "f").call(this, url.toString(), {
            method: method.toUpperCase(),
            headers,
            body: bodyAsJsonString !== null && bodyAsJsonString !== void 0 ? bodyAsJsonString : formData,
            agent: __classPrivateFieldGet(this, _Client_agent, "f")
          }), __classPrivateFieldGet(this, _Client_timeoutMs, "f"));
          const responseText = await response.text();
          if (!response.ok) {
            throw (0, errors_1.buildRequestError)(response, responseText);
          }
          const responseJson = JSON.parse(responseText);
          this.log(logging_1.LogLevel.INFO, "request success", { method, path });
          return responseJson;
        } catch (error) {
          if (!(0, errors_1.isNotionClientError)(error)) {
            throw error;
          }
          this.log(logging_1.LogLevel.WARN, "request fail", {
            code: error.code,
            message: error.message
          });
          if ((0, errors_1.isHTTPResponseError)(error)) {
            this.log(logging_1.LogLevel.DEBUG, "failed response body", {
              body: error.body
            });
          }
          throw error;
        }
      }
      /**
       * Emits a log message to the console.
       *
       * @param level The level for this message
       * @param args Arguments to send to the console
       */
      log(level, message, extraInfo) {
        if ((0, logging_1.logLevelSeverity)(level) >= (0, logging_1.logLevelSeverity)(__classPrivateFieldGet(this, _Client_logLevel, "f"))) {
          __classPrivateFieldGet(this, _Client_logger, "f").call(this, level, message, extraInfo);
        }
      }
      /**
       * Transforms an API key or access token into a headers object suitable for an HTTP request.
       *
       * This method uses the instance's value as the default when the input is undefined. If neither are defined, it returns
       * an empty object
       *
       * @param auth API key or access token
       * @returns headers key-value object
       */
      authAsHeaders(auth) {
        const headers = {};
        const authHeaderValue = auth !== null && auth !== void 0 ? auth : __classPrivateFieldGet(this, _Client_auth, "f");
        if (authHeaderValue !== void 0) {
          headers["authorization"] = `Bearer ${authHeaderValue}`;
        }
        return headers;
      }
    };
    exports2.default = Client2;
    _Client_auth = /* @__PURE__ */ new WeakMap(), _Client_logLevel = /* @__PURE__ */ new WeakMap(), _Client_logger = /* @__PURE__ */ new WeakMap(), _Client_prefixUrl = /* @__PURE__ */ new WeakMap(), _Client_timeoutMs = /* @__PURE__ */ new WeakMap(), _Client_notionVersion = /* @__PURE__ */ new WeakMap(), _Client_fetch = /* @__PURE__ */ new WeakMap(), _Client_agent = /* @__PURE__ */ new WeakMap(), _Client_userAgent = /* @__PURE__ */ new WeakMap();
    Client2.defaultNotionVersion = "2022-06-28";
  }
});

// node_modules/@notionhq/client/build/src/helpers.js
var require_helpers = __commonJS({
  "node_modules/@notionhq/client/build/src/helpers.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isMentionRichTextItemResponse = exports2.isEquationRichTextItemResponse = exports2.isTextRichTextItemResponse = exports2.isFullComment = exports2.isFullUser = exports2.isFullPageOrDatabase = exports2.isFullDatabase = exports2.isFullPage = exports2.isFullBlock = exports2.collectPaginatedAPI = exports2.iteratePaginatedAPI = void 0;
    async function* iteratePaginatedAPI(listFn, firstPageArgs) {
      let nextCursor = firstPageArgs.start_cursor;
      do {
        const response = await listFn({
          ...firstPageArgs,
          start_cursor: nextCursor
        });
        yield* response.results;
        nextCursor = response.next_cursor;
      } while (nextCursor);
    }
    exports2.iteratePaginatedAPI = iteratePaginatedAPI;
    async function collectPaginatedAPI(listFn, firstPageArgs) {
      const results = [];
      for await (const item of iteratePaginatedAPI(listFn, firstPageArgs)) {
        results.push(item);
      }
      return results;
    }
    exports2.collectPaginatedAPI = collectPaginatedAPI;
    function isFullBlock(response) {
      return response.object === "block" && "type" in response;
    }
    exports2.isFullBlock = isFullBlock;
    function isFullPage(response) {
      return response.object === "page" && "url" in response;
    }
    exports2.isFullPage = isFullPage;
    function isFullDatabase(response) {
      return response.object === "database" && "title" in response;
    }
    exports2.isFullDatabase = isFullDatabase;
    function isFullPageOrDatabase(response) {
      if (response.object === "database") {
        return isFullDatabase(response);
      } else {
        return isFullPage(response);
      }
    }
    exports2.isFullPageOrDatabase = isFullPageOrDatabase;
    function isFullUser(response) {
      return "type" in response;
    }
    exports2.isFullUser = isFullUser;
    function isFullComment(response) {
      return "created_by" in response;
    }
    exports2.isFullComment = isFullComment;
    function isTextRichTextItemResponse(richText) {
      return richText.type === "text";
    }
    exports2.isTextRichTextItemResponse = isTextRichTextItemResponse;
    function isEquationRichTextItemResponse(richText) {
      return richText.type === "equation";
    }
    exports2.isEquationRichTextItemResponse = isEquationRichTextItemResponse;
    function isMentionRichTextItemResponse(richText) {
      return richText.type === "mention";
    }
    exports2.isMentionRichTextItemResponse = isMentionRichTextItemResponse;
  }
});

// node_modules/@notionhq/client/build/src/index.js
var require_src = __commonJS({
  "node_modules/@notionhq/client/build/src/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isFullPageOrDatabase = exports2.isFullComment = exports2.isFullUser = exports2.isFullPage = exports2.isFullDatabase = exports2.isFullBlock = exports2.iteratePaginatedAPI = exports2.collectPaginatedAPI = exports2.isNotionClientError = exports2.RequestTimeoutError = exports2.UnknownHTTPResponseError = exports2.APIResponseError = exports2.ClientErrorCode = exports2.APIErrorCode = exports2.LogLevel = exports2.Client = void 0;
    var Client_1 = require_Client();
    Object.defineProperty(exports2, "Client", { enumerable: true, get: function() {
      return Client_1.default;
    } });
    var logging_1 = require_logging();
    Object.defineProperty(exports2, "LogLevel", { enumerable: true, get: function() {
      return logging_1.LogLevel;
    } });
    var errors_1 = require_errors();
    Object.defineProperty(exports2, "APIErrorCode", { enumerable: true, get: function() {
      return errors_1.APIErrorCode;
    } });
    Object.defineProperty(exports2, "ClientErrorCode", { enumerable: true, get: function() {
      return errors_1.ClientErrorCode;
    } });
    Object.defineProperty(exports2, "APIResponseError", { enumerable: true, get: function() {
      return errors_1.APIResponseError;
    } });
    Object.defineProperty(exports2, "UnknownHTTPResponseError", { enumerable: true, get: function() {
      return errors_1.UnknownHTTPResponseError;
    } });
    Object.defineProperty(exports2, "RequestTimeoutError", { enumerable: true, get: function() {
      return errors_1.RequestTimeoutError;
    } });
    Object.defineProperty(exports2, "isNotionClientError", { enumerable: true, get: function() {
      return errors_1.isNotionClientError;
    } });
    var helpers_1 = require_helpers();
    Object.defineProperty(exports2, "collectPaginatedAPI", { enumerable: true, get: function() {
      return helpers_1.collectPaginatedAPI;
    } });
    Object.defineProperty(exports2, "iteratePaginatedAPI", { enumerable: true, get: function() {
      return helpers_1.iteratePaginatedAPI;
    } });
    Object.defineProperty(exports2, "isFullBlock", { enumerable: true, get: function() {
      return helpers_1.isFullBlock;
    } });
    Object.defineProperty(exports2, "isFullDatabase", { enumerable: true, get: function() {
      return helpers_1.isFullDatabase;
    } });
    Object.defineProperty(exports2, "isFullPage", { enumerable: true, get: function() {
      return helpers_1.isFullPage;
    } });
    Object.defineProperty(exports2, "isFullUser", { enumerable: true, get: function() {
      return helpers_1.isFullUser;
    } });
    Object.defineProperty(exports2, "isFullComment", { enumerable: true, get: function() {
      return helpers_1.isFullComment;
    } });
    Object.defineProperty(exports2, "isFullPageOrDatabase", { enumerable: true, get: function() {
      return helpers_1.isFullPageOrDatabase;
    } });
  }
});

// netlify/functions/send-feedback.cjs
var { Client } = require_src();
var notion = new Client({ auth: process.env.NOTION_SECRET });
var databaseId = process.env.NOTION_DATABASE_ID;
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" })
    };
  }
  try {
    const data = JSON.parse(event.body);
    const { name, email, message } = data;
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields" })
      };
    }
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [{ text: { content: name } }]
        },
        Email: {
          email
        },
        Message: {
          rich_text: [{ text: { content: message } }]
        }
      }
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Feedback saved to Notion!" })
    };
  } catch (error) {
    console.error("\u274C Notion error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to save feedback." })
    };
  }
};
//# sourceMappingURL=send-feedback.js.map
