/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */

// @ts-check
declare module 'sequelize' {
	// eslint-disable-next-line no-undef
	export * from 'sequelize/types/index.d';

	// eslint-disable-next-line no-undef
	type OldDataTypes = Awaited<typeof import('sequelize/types/data-types')>;
	type ADTC = OldDataTypes['BOOLEAN'];
	type NumberDataTypeConstructor = OldDataTypes['NUMBER'];
	type StringDataTypeConstructor = OldDataTypes['STRING'];
	type DateDataTypeConstructor = OldDataTypes['DATE'];
	type TextDataTypeConstructor = OldDataTypes['TEXT'];
	type EnumDataTypeConstructor = OldDataTypes['ENUM'];
	type EnumDataType = OldDataTypes.EnumDataType;

	export interface BOOLEANDataTypeConstructor extends ADTC {
		_type: 'BOOLEAN';
	}
	export interface JSONBDataTypeConstructor extends ADTC {
		_type: 'JSONB';
	}
	export interface JSONDataTypeConstructor extends ADTC {
		_type: 'JSON';
	}
	export interface NOWDataTypeConstructor extends ADTC {
		_type: 'NOW';
	}
	export interface CIDRDataTypeConstructor extends ADTC {
		_type: 'CIDR';
	}
	export interface CITEXTDataTypeConstructor extends ADTC {
		_type: 'CITEXT';
	}
	export interface UUIDDataTypeConstructor extends ADTC {
		_type: 'UUID';
	}
	export interface UUIDV1DataTypeConstructor extends ADTC {
		_type: 'UUIDV1';
	}
	export interface UUIDV4DataTypeConstructor extends ADTC {
		_type: 'UUIDV4';
	}
	export interface INETDataTypeConstructor extends ADTC {
		_type: 'INET';
	}
	export interface MACADDRDataTypeConstructor extends ADTC {
		_type: 'MACADDR';
	}

	interface NewDataTypes extends OldDataTypes {
		BOOLEAN: BOOLEANDataTypeConstructor;
		JSONB: JSONBDataTypeConstructor;
		JSON: JSONDataTypeConstructor;
		NOW: NOWDataTypeConstructor;
		CIDR: CIDRDataTypeConstructor;
		CITEXT: CITEXTDataTypeConstructor;
		UUID: UUIDDataTypeConstructor;
		UUIDV1: UUIDV1DataTypeConstructor;
		UUIDV4: UUIDV4DataTypeConstructor;
		INET: INETDataTypeConstructor;
		MACADDR: MACADDRDataTypeConstructor;
	}

	type Nullable<B extends boolean, T> = B extends false ? T : T | null;

	type MapAttribute<T, M extends Record<string, any> = {}> = {
		/** Test  */
		[K in keyof T]: T[K] extends {
			allowNull?: infer B extends boolean;
			type: infer Tt extends ADTC | EnumDataType<any>;
		}
			? Tt extends
					| StringDataTypeConstructor
					| TextDataTypeConstructor
					| UUIDDataTypeConstructor
					| UUIDV1DataTypeConstructor
					| UUIDV4DataTypeConstructor
					| INETDataTypeConstructor
					| MACADDRDataTypeConstructor
					| CITEXTDataTypeConstructor
					| CIDRDataTypeConstructor
				? Nullable<B, string>
				: Tt extends NumberDataTypeConstructor
				? Nullable<B, number>
				: Tt extends BOOLEANDataTypeConstructor
				? Nullable<B, boolean>
				: Tt extends JSONDataTypeConstructor | JSONBDataTypeConstructor
				? Nullable<B, any>
				: Tt extends DateDataTypeConstructor | NOWDataTypeConstructor
				? Nullable<B, Date>
				: Tt extends EnumDataType
				? Nullable<B, Tt['values'][number]>
				: never
			: T[K] extends {
					model: infer Mm extends keyof M;
					relation: infer R extends 'hasMany' | 'hasOne' | 'belongsTo' | 'belongsToMany';
					allowNull?: infer B extends boolean;
			  }
			? R extends 'hasMany'
				? Nullable<B, M[Mm][]>
				: R extends 'hasOne'
				? Nullable<B, M[Mm]>
				: R extends 'belongsTo'
				? Nullable<B, string>
				: R extends 'belongsToMany'
				? Nullable<B, string[]>
				: 'h'
			: never;
	};

	type Writeable<T> = { -readonly [P in keyof T]: T[P] };

	export function inferTypeFromAttributes<const T, M = {}>(attributes: T) {
		return null as unknown as MapAttribute<Writeable<T, M>>;
	}

	export type InferTypeFromAttributes<T, M = {}> = typeof inferTypeFromAttributes<T, M>;

	export const DataTypes: NewDataTypes;

	const attributes = {
		pubId: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		viewed: {
			type: DataTypes.UUIDV4,
		},
		enum: {
			type: DataTypes.ENUM('a', 'b'),
		},
	} as const;

	type Attrs = InferTypeFromAttributes<typeof attributes>;

	const Attrst = inferTypeFromAttributes(attributes);
}
