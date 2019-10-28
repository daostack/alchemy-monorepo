import { first} from 'rxjs/operators'
import { Arc, DAO, Proposal, Tag } from '../src'
import { createAProposal, newArc, getTestDAO } from './utils'

/**
 * Tag test
 */
describe('Tag', () => {

  let arc: Arc
  let dao: DAO
  const tags = ['tag1', 'tag2']
  const moretags = ['tag3', 'tag4']

  beforeAll(async () => {
    arc = await newArc()
    dao = await getTestDAO()
  })

  it('Tag is instantiable', () => {
    const tag = new Tag({
      id: '0x1234id',
    }, arc)
    expect(tag).toBeInstanceOf(Tag)
  })

  it('Tags are saved on a proposal', async () => {
    const proposal = await createAProposal(dao, { tags })
    const proposalState = await (new Proposal(proposal.id, arc)).state().pipe(first()).toPromise()
    expect(proposalState.tags).toEqual(tags)
  })

  it('proposals are searchable by tag', async () => {
    const proposal = await createAProposal(dao, { tags })
    const proposals = await Proposal.search(arc, { where: { tags_contains: ['tag1']}}).pipe(first()).toPromise()
    expect(proposals.map((p: Proposal) => p.id)).toContain(proposal.id)
  })

  it('Tag are searchable', async () => {
    let result: any
    await createAProposal(dao, { tags })

    result = await Tag.search(arc, {where: {id: 'tag1'}})
      .pipe(first()).toPromise()
    expect(result.map((t: Tag) => t.id)).toEqual(['tag1'])
    result = await Tag
      .search(arc, {where:  {id: 'hi_there'}})
      .pipe(first()).toPromise()
    expect(result).toEqual([])
  })

  it('paging and sorting works', async () => {
    await createAProposal(dao, { tags: moretags.concat(tags) })
    const ls1 = await Tag.search(arc, { first: 3, orderBy: 'id' }).pipe(first()).toPromise()
    expect(ls1.map((t: Tag) => t.id)).toEqual(['tag1', 'tag2', 'tag3'])

    const ls2 = await Tag.search(arc, { first: 2, skip: 2, orderBy: 'id' }).pipe(first()).toPromise()
    expect(ls2.map((t: Tag) => t.id)).toEqual(['tag3', 'tag4'])

    const ls3 = await Tag.search(arc, {  orderBy: 'id', orderDirection: 'desc'}).pipe(first()).toPromise()
    expect(ls3.map((t: Tag) => t.id)).toEqual(['tag4', 'tag3', 'tag2', 'tag1'])
  })

})
