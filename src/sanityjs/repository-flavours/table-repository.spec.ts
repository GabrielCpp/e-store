import { Column, PrimaryColumn, Entity, EntityRepository, createConnection, getRepository } from "typeorm"
import { TableRepository } from './table-repository'
import { IFilter } from "./irepository";
import { MAPPER, IMapper, Mapper, PartialMapper, AssignObject, TypeIdentifier } from "../mapper";
import { inject, injectable, Container, decorate } from "inversify";

interface PersonDomain {
    id: string;
    name: string;
    email: string;
}

function newPersonDomain(
    id: string,
    name: string,
    email: string
) {
    return {
        id, name, email
    }
}

interface PersonEntity {
    id: string;
    name: string;
    email: string;
}

@Entity({ name: 'user' })
class PersonTable implements PersonEntity {
    @PrimaryColumn("varchar", { length: 32 })
    id: string;
    @Column()
    name: string;
    @Column()
    email: string;
}

const DELETE_PERSON_BY_ID = Symbol.for('DeletePersonById')

interface DeletePersonById extends IFilter {
    id: string;
}

function newDeleteByIdQuery(id: string): DeletePersonById {
    return { discriminator: DELETE_PERSON_BY_ID, id }
}

@injectable()
@EntityRepository(PersonTable)
class PersonRepository extends TableRepository<PersonDomain, PersonEntity> {
    @inject(MAPPER) protected mapper: IMapper;
    protected domain: TypeIdentifier = Symbol.for('PersonDomain');
    protected entity: new () => PersonEntity = PersonTable;
    protected deleteFilters = TableRepository.createDeleteFilters<PersonEntity>([
        [DELETE_PERSON_BY_ID, (q: DeletePersonById, b) => b.where('id = :id ').setParameters({ 'id': q.id })]
    ])

    protected queryFilters = TableRepository.createQueryFilters<PersonEntity>([])
    protected updateFilters = TableRepository.createUpdateFilters<PersonEntity>([])
}

const mapDomainEntity = new PartialMapper(Symbol.for('PersonDomain'), PersonTable, [
    new AssignObject()
])

describe('TableRepository', () => {
    let container: Container;
    let mapper: Mapper;
    let personDomain: PersonDomain;

    beforeAll(() => {
        decorate(injectable(), TableRepository)

        return createConnection({
            type: 'sqlite',
            database: ":memory:",
            dropSchema: true,
            synchronize: true,
            entities: [PersonTable],
            logging: false
        })
    })

    beforeEach(() => {
        mapper = new Mapper()
        mapper.addMapper(mapDomainEntity)

        container = new Container()
        container.bind<PersonRepository>(PersonRepository).to(PersonRepository);
        container.bind<IMapper>(MAPPER).toConstantValue(mapper)

        personDomain = newPersonDomain('3b94b529-cdaf-4fb7-a1ea-8b2eaa62c0fa', 'Test', 'test@gmail.com')
    })

    afterEach(() => {
        return getRepository(PersonTable).createQueryBuilder().delete();
    })

    test('Given person domain should be able to save it', async () => {

        const repository = container.get(PersonRepository);

        await repository.add(personDomain)
        const results = await getRepository(PersonTable).find()

        expect(results).toEqual([personDomain])
    })

    test('Given person domain in database should be able to retrieve all elements of table', async () => {
        const repository = container.get(PersonRepository);

        await getRepository(PersonTable).save(personDomain)
        const results = await repository.findAll();

        expect(results).toEqual([personDomain])
    })

    test('Given remove person domain in database by id should element be removed', async () => {
        const repository = container.get(PersonRepository);

        await getRepository(PersonTable).save(personDomain)
        await repository.removeBy(newDeleteByIdQuery(personDomain.id))
        const results = await getRepository(PersonTable).find()

        expect(results).toEqual([])
    })
})