import {
	Model,
	Table,
	Column,
	DataType,
	PrimaryKey,
	Default,
	AllowNull,
	IsLowercase,
	Length,
	Is,
	IsEmail,
	HasMany,
	HasOne,
	Unique,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import passportLocalSequelize from 'passport-local-sequelize';
import { PubAttribution, Discussion, UserNotificationPreferences } from '../models';

@Table
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	@Default(DataType.UUIDV4)
	@PrimaryKey
	@Column(DataType.UUID)
	id!: CreationOptional<string>;

	@Unique
	@AllowNull(false)
	@IsLowercase
	@Length({ min: 1, max: 280 })
	@Is(/^[a-zA-Z0-9-]+$/)
	@Column(DataType.TEXT)
	slug!: string;

	@AllowNull(false)
	@Column(DataType.TEXT)
	firstName!: string;

	@AllowNull(false)
	@Column(DataType.TEXT)
	lastName!: string;

	@AllowNull(false)
	@Column(DataType.TEXT)
	fullName!: string;

	@AllowNull(false)
	@Column(DataType.STRING)
	initials!: string;

	@Column(DataType.TEXT)
	avatar?: string | null;

	@Column(DataType.TEXT)
	bio?: string | null;

	@Column(DataType.TEXT)
	title?: string | null;

	@Unique
	@AllowNull(false)
	@IsLowercase
	@IsEmail
	@Column(DataType.TEXT)
	email!: string;

	@IsLowercase
	@IsEmail
	@Column(DataType.TEXT)
	publicEmail?: string | null;

	@Column(DataType.TEXT)
	authRedirectHost?: string | null;

	@Column(DataType.TEXT)
	location?: string | null;

	@Column(DataType.TEXT)
	website?: string | null;

	@Column(DataType.TEXT)
	facebook?: string | null;

	@Column(DataType.TEXT)
	twitter?: string | null;

	@Column(DataType.TEXT)
	github?: string | null;

	@Column(DataType.TEXT)
	orcid?: string | null;

	@Column(DataType.TEXT)
	googleScholar?: string | null;

	@Column(DataType.DATE)
	resetHashExpiration?: Date | null;

	@Column(DataType.TEXT)
	resetHash?: string | null;

	@Column(DataType.BOOLEAN)
	inactive?: boolean | null;

	@Column(DataType.INTEGER)
	pubpubV3Id?: number | null;

	@Column(DataType.TEXT)
	passwordDigest?: string | null;

	@AllowNull(false)
	@Column(DataType.TEXT)
	hash!: string;

	@AllowNull(false)
	@Column(DataType.TEXT)
	salt!: string;

	@Column(DataType.BOOLEAN)
	gdprConsent?: boolean | null;

	@AllowNull(false)
	@Column(DataType.BOOLEAN)
	isSuperAdmin!: boolean;

	@HasMany(() => PubAttribution, {
		onDelete: 'CASCADE',
		as: 'attributions',
		foreignKey: 'userId',
	})
	attributions?: PubAttribution[];

	@HasMany(() => Discussion, { onDelete: 'CASCADE', as: 'discussions', foreignKey: 'userId' })
	discussions?: Discussion[];

	@HasOne(() => UserNotificationPreferences, {
		onDelete: 'CASCADE',
		as: 'userNotificationPreferences',
		foreignKey: 'userId',
	})
	userNotificationPreferences?: UserNotificationPreferences;

	// declare beforeCreate(function(user, op, next) {
	//     // if specified, convert the username to lowercase
	//     if (options.usernameLowerCase) {
	//         user[options.usernameField] = user[options.usernameField].toLowerCase();
	//     }
	//     if (typeof(next) === 'function') {
	//         next(null, user);
	//     }
	// });

	declare setPassword: (password: string, cb: (err: any, user?: any) => void) => void;
	//    = function (password, cb) {
	//         if (!password) {
	//             return cb(new Error(options.missingPasswordError));
	//         }

	//         var self = this;

	//         crypto.randomBytes(options.saltlen, function (err, buf) {
	//             if (err) {
	//                 return cb(err);
	//             }

	//             var salt = buf.toString('hex');

	//             crypto.pbkdf2(password, salt, options.iterations, options.keylen, options.digest, function (err, hashRaw) {
	//                 if (err) {
	//                     return cb(err);
	//                 }

	//                 self.set(options.hashField, Buffer.from(hashRaw).toString('hex'));
	//                 self.set(options.saltField, salt);

	//                 cb(null, self);
	//             });
	//         });
	//     };

	declare setActivationKey: (cb: (err: any, user?: any) => void) => void;
	//   = function (cb) {

	//         var self = this;

	//         if (!options.activationRequired) {
	//             return cb(null, self);
	//         }

	//         crypto.randomBytes(options.activationkeylen, function (err, buf) {
	//             if (err) {
	//                 return cb(err);
	//             }

	//             var randomHex = buf.toString('hex');
	//             self.set(options.activationKeyField, randomHex);
	//             cb(null, self);

	//         });
	//     };

	declare authenticate: (
		password: string,
		cb: (err: any, user?: any, info?: any) => void,
	) => void;
	//   = function (password, cb) {
	//         var self = this;

	//         // prevent to throw error from crypto.pbkdf2
	//         if (!this.get(options.saltField)) {
	//             return cb(null, false, { message: options.noSaltValueStoredError });
	//         }

	//         crypto.pbkdf2(password, this.get(options.saltField), options.iterations, options.keylen, options.digest, function (err, hashRaw) {
	//             if (err) {
	//                 return cb(err);
	//             }

	//             var hash = Buffer.from(hashRaw).toString('hex');

	//             if (hash === self.get(options.hashField)) {
	//                 return cb(null, self);
	//             } else {
	//                 return cb(null, false, { message: options.incorrectPasswordError });
	//             }
	//         });
	//     };

	declare authenticate: () => (
		username: string,
		password: string,
		cb: (err: any, user?: any, info?: any) => void,
	) => void;
	//  = function () {
	//         var self = this;
	//         return function (username, password, cb) {
	//             self.findByUsername(username, function (err, user) {
	//                 if (err) { return cb(err); }

	//                 if (user) {
	//                     return user.authenticate(password, cb);
	//                 } else {
	//                     return cb(null, false, { message: options.incorrectUsernameError });
	//                 }
	//             });
	//         };
	//     };

	declare serializeUser: () => (user: User, cb: (err: any, id?: any) => void) => User[];
	//  = function () {
	//         return function (user, cb) {
	//             cb(null, user.get(options.usernameField));
	//         };
	//     };

	declare deserializeUser: () => (username: string, cb: (err: any, user?: any) => void) => User;
	//  = function () {
	//         var self = this;
	//         return function (username, cb) {
	//             self.findByUsername(username, cb);
	//         };
	//     };

	declare register: (user: User, password: string, cb: (err: any, user?: any) => void) => User;
	//= function (user, password, cb) {
	//     var self = this,
	//         fields = {};

	//     if (user instanceof UserSchema) {
	//         // Do nothing
	//     } else if (_.isString(user)) {
	//         // Create an instance of this in case user is passed as username
	//         fields[options.usernameField] = user;

	//         user = self.build(fields);
	//     } else if (_.isObject(user)) {
	//         // Create an instance if user is passed as fields
	//         user = self.build(user);
	//     }

	//     if (!user.get(options.usernameField)) {
	//         return cb(new Error(util.format(options.missingUsernameError, options.usernameField)));
	//     }

	//     self.findByUsername(user.get(options.usernameField), function (err, existingUser) {
	//         if (err) { return cb(err); }

	//         if (existingUser) {
	//             return cb(new Error(util.format(options.userExistsError, user.get(options.usernameField))));
	//         }

	//         user.setPassword(password, function (err, user) {
	//             if (err) {
	//                 return cb(err);
	//             }

	//             user.setActivationKey(function (err, user) {
	//                 if (err) {
	//                   return cb(err);
	//                 }

	//                 user.save()
	//                 .then(function() {
	//                     cb(null, user);
	//                 })
	//                 .catch(function (err) {
	//                     return cb(err);
	//                 });

	//             });

	//         });
	//     });
	// };

	declare activate: (
		username: string,
		password: string,
		activationKey: string,
		cb: (err: any, user?: any) => void,
	) => void;
	// = function (username, password, activationKey, cb) {
	//     var self = this;
	//     var auth = self.authenticate();
	//     auth(username, password, function (err, user, info) {

	//         if (err) { return cb(err); }

	//         if (!user) { return cb(info); }

	//         if (user.get(options.activationKeyField) === activationKey) {
	//             user.update({ verified: true, activationKey: 'null' })
	//             .then(function() {
	//               return cb(null, user);
	//             })
	//             .catch(function (err) {
	//               return cb(err);
	//             });
	//         } else {
	//             return cb({ message: options.invalidActivationKeyError });
	//         }
	//     });
	// };

	declare findByUsername: (username: string, cb: (err: any, user?: any) => void) => void;
	//= function (username, cb) {
	//     var queryParameters = {};

	//     // if specified, convert the username to lowercase
	//     if (options.usernameLowerCase) {
	//         username = username.toLowerCase();
	//     }

	//     queryParameters[options.usernameField] = username;

	//     var query = this.findOne({ where: queryParameters });
	//     if (options.selectFields) {
	//         query.select(options.selectFields);
	//     }
	//     query.then(function (user) {
	//         cb(null, user);
	//     });
	//     query.catch(function (err) {
	//         cb(err);
	//     });
	// };

	declare setResetPasswordKey: (username: string, cb: (err: any, user?: any) => void) => void;
	//  = function (username, cb) {
	//         var self = this;
	//         self.findByUsername(username, function (err, user) {
	//             if (err) { return cb(err); }
	//             if (!user) { return cb({ message: options.incorrectUsernameError }); }

	//             crypto.randomBytes(options.resetPasswordkeylen, function (err, buf) {
	//                 if (err) { return cb(err); }
	//                 var randomHex = buf.toString('hex');
	//                 user.set(options.resetPasswordKeyField, randomHex);
	//                 user.save()
	//                 .then(function() {
	//                   return cb(null, user);
	//                 })
	//                 .catch(function (err) {
	//                  return cb(err);
	//                 });
	//             });
	//         });
	//     };

	declare resetPassword: (
		username: string,
		password: string,
		resetPasswordKey: string,
		cb: (err: any, user?: any) => void,
	) => void;
	//= function (username, password, resetPasswordKey, cb) {
	//     var self = this;
	//     self.findByUsername(username, function (err, user) {
	//         if (err) { return cb(err); }
	//         if (!user) { return cb({ message: options.incorrectUsernameError }); }
	//         if (user.get(options.resetPasswordKeyField) === resetPasswordKey) {
	//             user.setPassword(password, function (err, user) {
	//                 if (err) { return cb(err); }
	//                 user.set(options.resetPasswordKeyField, null);
	//                 user.save()
	//                 .then(function() {
	//                   cb(null, user);
	//                 })
	//                 .catch(function (err) {
	//                   return cb(err);
	//                 });
	//             });
	//         } else {
	//             return cb({ message: options.invalidResetPasswordKeyError });
	//         }
	//     });
	// };

	declare createStrategy: () => any;
	//   = function () {
	//         return new LocalStrategy(options, this.authenticate());
	//     };
}

passportLocalSequelize.attachToUser(User, {
	usernameField: 'email',
	hashField: 'hash',
	saltField: 'salt',
	digest: 'sha512',
	iterations: 25000,
});

//export const User = UserWithoutPassPort;

export const attributesPublicUser = [
	'id',
	'firstName',
	'lastName',
	'fullName',
	'avatar',
	'slug',
	'initials',
	'title',
	'orcid',
] as const;

export const includeUserModel = (() => {
	return (options) => {
		const { attributes: providedAttributes = [], ...restOptions } = options;
		const attributes = [...new Set([...attributesPublicUser, ...providedAttributes])];
		// eslint-disable-next-line pubpub-rules/no-user-model
		return {
			model: User,
			attributes,
			...restOptions,
		};
	};
})();
