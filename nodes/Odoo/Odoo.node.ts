import {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';

import {
	IOdooFilterOperations,
	odooCreate,
	odooDelete,
	odooGet,
	odooGetActionMethods,
	odooGetAll,
	odooGetDBName,
	odooGetModelFields,
	odooGetUserID,
	odooJSONRPCRequest,
	odooUpdate,
	odooSearch,
	odooSearchCount,
	odooCopy,
	odooExists,
	odooNameGet,
	odooNameSearch,
	odooCheckAccessRights,
	odooReadGroup,
	processNameValueFields,
} from './GenericFunctions';
import { resourceDescription, resourceOperations } from './ResourceDescription';

export class Odoo implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Odoo',
		name: 'odoo',
		icon: 'file:odoo.svg',
		group: ['transform'],
		version: 1,
		description: 'Consume Odoo API',
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		defaults: {
			name: 'Odoo',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'odooApi',
				required: true,
				testedBy: 'odooApiTest',
			},
		],
		properties: [...resourceOperations, ...resourceDescription],
	};

	methods = {
		loadOptions: {
			async getModelFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				let resource;
				resource = this.getCurrentNodeParameter('resource') as string;
				if (!resource) {
					return [];
				}

				const credentials = await this.getCredentials('odooApi');
				const url = credentials?.url as string;
				const username = credentials?.username as string;
				const password = credentials?.password as string;
				const db = odooGetDBName(credentials?.db as string, url);
				const userID = await odooGetUserID.call(this, db, username, password, url);

				const response = await odooGetModelFields.call(this, db, userID, password, resource, url);

				const options = Object.entries(response).map(([k, v]) => {
					const optionField = v as { [key: string]: string };
					return {
						name: optionField.string,
						value: k,
						// nodelinter-ignore-next-line
						description: `name: ${optionField?.string}, type: ${optionField?.type} required: ${optionField?.required}`,
					};
				});

				return options.sort((a, b) => a.name?.localeCompare(b.name) || 0);
			},
			async getModels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('odooApi');
				const url = credentials?.url as string;
				const username = credentials?.username as string;
				const password = credentials?.password as string;
				const db = odooGetDBName(credentials?.db as string, url);
				const userID = await odooGetUserID.call(this, db, username, password, url);

				const body = {
					jsonrpc: '2.0',
					method: 'call',
					params: {
						service: 'object',
						method: 'execute',
						args: [
							db,
							userID,
							password,
							'ir.model',
							'search_read',
							[],
							['name', 'model', 'modules'],
						],
					},
					id: Math.floor(Math.random() * 100),
				};

				const response = (await odooJSONRPCRequest.call(this, body, url)) as IDataObject[];

				const options = response.map((model) => ({
					name: model.name,
					value: model.model,
					// eslint-disable-next-line n8n-nodes-base/node-param-description-line-break-html-tag
					description: `Model: ${model.model}<br> Modules: ${model.modules}`,
				}));
				return options as INodePropertyOptions[];
			},
			async getStates(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('odooApi');
				const url = credentials?.url as string;
				const username = credentials?.username as string;
				const password = credentials?.password as string;
				const db = odooGetDBName(credentials?.db as string, url);
				const userID = await odooGetUserID.call(this, db, username, password, url);

				const body = {
					jsonrpc: '2.0',
					method: 'call',
					params: {
						service: 'object',
						method: 'execute',
						args: [db, userID, password, 'res.country.state', 'search_read', [], ['id', 'name']],
					},
					id: Math.floor(Math.random() * 100),
				};

				const response = (await odooJSONRPCRequest.call(this, body, url)) as IDataObject[];

				const options = response.map((state) => ({
					name: state.name as string,
					value: state.id,
				}));
				return options.sort((a, b) => a.name?.localeCompare(b.name) || 0) as INodePropertyOptions[];
			},
			async getCountries(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('odooApi');
				const url = credentials?.url as string;
				const username = credentials?.username as string;
				const password = credentials?.password as string;
				const db = odooGetDBName(credentials?.db as string, url);
				const userID = await odooGetUserID.call(this, db, username, password, url);

				const body = {
					jsonrpc: '2.0',
					method: 'call',
					params: {
						service: 'object',
						method: 'execute',
						args: [db, userID, password, 'res.country', 'search_read', [], ['id', 'name']],
					},
					id: Math.floor(Math.random() * 100),
				};

				const response = (await odooJSONRPCRequest.call(this, body, url)) as IDataObject[];

				const options = response.map((country) => ({
					name: country.name as string,
					value: country.id,
				}));

				return options.sort((a, b) => a.name?.localeCompare(b.name) || 0) as INodePropertyOptions[];
			},
			async getActions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				let resource;
				resource = this.getCurrentNodeParameter('resource') as string;
				if (!resource) {
					return [];
				}

				const credentials = await this.getCredentials('odooApi');
				const url = credentials?.url as string;
				const username = credentials?.username as string;
				const password = credentials?.password as string;
				const db = odooGetDBName(credentials?.db as string, url);
				const userID = await odooGetUserID.call(this, db, username, password, url);

				const response = await odooGetActionMethods.call(this, db, userID, password, resource, url);

				if (response) {
					const options = response.map((x) => ({
						name: x,
						value: x,
					}));

					return options;
				} else {
					return [];
				}
			},
			async getOperations(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const operations = [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new record',
					},
					{
						name: 'Read',
						value: 'get',
						description: 'Read a specific record by ID',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an existing record',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a record',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search for record IDs matching criteria',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Search and read records matching criteria',
					},
					{
						name: 'Search Count',
						value: 'searchCount',
						description: 'Count records matching search criteria',
					},
					{
						name: 'Copy',
						value: 'copy',
						description: 'Duplicate an existing record',
					},
					{
						name: 'Exists',
						value: 'exists',
						description: 'Check if a record exists',
					},
					{
						name: 'Name Get',
						value: 'nameGet',
						description: 'Get display names for record IDs',
					},
					{
						name: 'Name Search',
						value: 'nameSearch',
						description: 'Search records by name/display text',
					},
					{
						name: 'Read Group',
						value: 'readGroup',
						description: 'Read grouped and aggregated data',
					},
					{
						name: 'Check Access Rights',
						value: 'checkAccessRights',
						description: 'Check user access rights for operations',
					},
				];

				return operations;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let items = this.getInputData();
		items = JSON.parse(JSON.stringify(items));
		const returnData: IDataObject[] = [];
		let responseData;

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const credentials = await this.getCredentials('odooApi');
		const url = (credentials?.url as string).replace(/\/$/, '');
		const username = credentials?.username as string;
		const password = credentials?.password as string;
		const db = odooGetDBName(credentials?.db as string, url);
		const userID = await odooGetUserID.call(this, db, username, password, url);

		//----------------------------------------------------------------------
		//                            Main loop
		//----------------------------------------------------------------------

		for (let i = 0; i < items.length; i++) {
			try {
				if (operation === 'create') {
					const fields = this.getNodeParameter('fieldsToCreateOrUpdate', i) as IDataObject;
					responseData = await odooCreate.call(
						this,
						db,
						userID,
						password,
						resource,
						operation,
						url,
						processNameValueFields(fields),
					);
				}

				if (operation === 'delete') {
					const id = this.getNodeParameter('id', i) as string;
					responseData = await odooDelete.call(
						this,
						db,
						userID,
						password,
						resource,
						operation,
						url,
						id,
					);
				}

				if (operation === 'get') {
					const id = this.getNodeParameter('id', i) as string;
					const options = this.getNodeParameter('options', i) as IDataObject;
					const fields = (options.fieldsList as IDataObject[]) || [];
					responseData = await odooGet.call(
						this,
						db,
						userID,
						password,
						resource,
						operation,
						url,
						id,
						fields,
					);
				}

				if (operation === 'getAll') {
					const returnAll = this.getNodeParameter('returnAll', i) as boolean;
					const options = this.getNodeParameter('options', i) as IDataObject;
					const fields = (options.fieldsList as IDataObject[]) || [];
					const filter = this.getNodeParameter('filterRequest', i) as IOdooFilterOperations;
					if (returnAll) {
						responseData = await odooGetAll.call(
							this,
							db,
							userID,
							password,
							resource,
							operation,
							url,
							filter,
							fields,
						);
					} else {
						const offset = this.getNodeParameter('offset', i) as number;
						const limit = this.getNodeParameter('limit', i) as number;
						responseData = await odooGetAll.call(
							this,
							db,
							userID,
							password,
							resource,
							operation,
							url,
							filter,
							fields,
							offset,
							limit,
						);
					}
				}

				if (operation === 'update') {
					const id = this.getNodeParameter('id', i) as string;
					const fields = this.getNodeParameter('fieldsToCreateOrUpdate', i) as IDataObject;
					responseData = await odooUpdate.call(
						this,
						db,
						userID,
						password,
						resource,
						operation,
						url,
						id,
						processNameValueFields(fields),
					);
				}

				if (operation === 'search') {
					const filter = this.getNodeParameter('filterRequest', i) as IOdooFilterOperations;
					const returnAll = this.getNodeParameter('returnAll', i) as boolean;
					if (returnAll) {
						responseData = await odooSearch.call(
							this,
							db,
							userID,
							password,
							resource,
							url,
							filter,
						);
					} else {
						const offset = this.getNodeParameter('offset', i) as number;
						const limit = this.getNodeParameter('limit', i) as number;
						responseData = await odooSearch.call(
							this,
							db,
							userID,
							password,
							resource,
							url,
							filter,
							offset,
							limit,
						);
					}
				}

				if (operation === 'searchCount') {
					const filter = this.getNodeParameter('filterRequest', i) as IOdooFilterOperations;
					responseData = await odooSearchCount.call(
						this,
						db,
						userID,
						password,
						resource,
						url,
						filter,
					);
				}

				if (operation === 'copy') {
					const id = this.getNodeParameter('id', i) as string;
					const options = this.getNodeParameter('options', i) as IDataObject;
					const defaultValues = options.defaultValues as IDataObject;
					responseData = await odooCopy.call(
						this,
						db,
						userID,
						password,
						resource,
						url,
						id,
						defaultValues,
					);
				}

				if (operation === 'exists') {
					const id = this.getNodeParameter('id', i) as string;
					responseData = await odooExists.call(
						this,
						db,
						userID,
						password,
						resource,
						url,
						id,
					);
				}

				if (operation === 'nameGet') {
					const ids = this.getNodeParameter('ids', i) as string;
					const idsArray = ids.split(',').map(id => id.trim());
					responseData = await odooNameGet.call(
						this,
						db,
						userID,
						password,
						resource,
						url,
						idsArray,
					);
				}

				if (operation === 'nameSearch') {
					const name = this.getNodeParameter('name', i) as string;
					const options = this.getNodeParameter('options', i) as IDataObject;
					const filter = options.filterRequest as IOdooFilterOperations;
					const limit = options.limit as number || 100;
					responseData = await odooNameSearch.call(
						this,
						db,
						userID,
						password,
						resource,
						url,
						name,
						filter,
						limit,
					);
				}

				if (operation === 'readGroup') {
					const options = this.getNodeParameter('options', i) as IDataObject;
					const filter = this.getNodeParameter('filterRequest', i) as IOdooFilterOperations;
					const fields = (options.fieldsList as IDataObject[]) || [];
					const groupBy = (options.groupBy as string[]) || [];
					const offset = (options.offset as number) || 0;
					const limit = (options.limit as number) || 0;
					const orderBy = options.orderBy as string;
					const lazy = (options.lazy as boolean) !== false;
					responseData = await odooReadGroup.call(
						this,
						db,
						userID,
						password,
						resource,
						url,
						filter,
						fields.map(f => f.toString()),
						groupBy,
						offset,
						limit,
						orderBy,
						lazy,
					);
				}

				if (operation === 'checkAccessRights') {
					const accessOperation = this.getNodeParameter('accessOperation', i) as 'read' | 'write' | 'create' | 'unlink';
					const options = this.getNodeParameter('options', i) as IDataObject;
					const raiseException = (options.raiseException as boolean) || false;
					responseData = await odooCheckAccessRights.call(
						this,
						db,
						userID,
						password,
						resource,
						url,
						accessOperation,
						raiseException,
					);
				}

				if (Array.isArray(responseData)) {
					returnData.push.apply(returnData, responseData);
				} else if (responseData !== undefined) {
					returnData.push(responseData);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: (error as JsonObject).message });
					continue;
				}
				throw error;
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
