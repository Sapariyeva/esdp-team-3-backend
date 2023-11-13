import { EOrganizationType } from "./EOrganizationType.enum";

export interface ICustomer {
    id: number;
    identifying_number: number;
    organization_type: EOrganizationType;
    name: string;
    user_id: number;
}