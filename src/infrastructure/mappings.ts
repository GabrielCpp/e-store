import { PartialMapper, DirectCopies, ConvertTwowWays } from "@/shared";
import { UserTable } from "./entities";
import { USER_DOMAIN } from '../core/domains/user-domain';
import { uuidToBuffer } from "@/shared"
import { bufferToUuid } from "@/shared"

export const userDomainEntityMapping = new PartialMapper(USER_DOMAIN, UserTable, [
    new DirectCopies('name', 'email'),
    new ConvertTwowWays('id', 'id', v => uuidToBuffer(v as string), v => bufferToUuid(v as Buffer)),
])

