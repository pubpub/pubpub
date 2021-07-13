/* global describe, it, expect, beforeAll, afterAll */
import { modelize, setup, teardown } from 'stubstub';
import { getCountOfPubsOrCollections } from 'server/community/queries';



// 1. User is Member of Community => true
// 2. User is Member of Collection in Community => true
// 3. User is Member of Pub in Community => true
// 4. User has PubAttribution in Pub Community => true
// 5. User has CollectionAttribution in Collection in Community => true
// 6. User has no affiliation with Community => false
// 7. User is a Member of another Community => false

const models = modelize`
    Community theCommunity {
        Member {
            permissions: "view"
            User communityMember {}
        }

        Collection {
            Member {
                permissions: "view"
                User collectionUser {}
            }

            CollectionAttribution {
                User collectionAttrUser {}
            }
        }

        Pub {
            Member {
                permissions: "view"
                User pubUser {}
            }

            PubAttribution {
                User pubAttrUser {}
            }
        }
    }

    Community {
        Member {
            permissions: "admin"
            User randoCommunityAdmin {} 
        }
        
    }
    User notACommunityMember {}
`;

setup(beforeAll, models.resolve);
teardown(afterAll);

// i dont get how to access stuff but he said it wasnt a tree so maybe just directlt cause userId is on pub maybe
describe('getCountOfPubsOrCollections', () => {
    it('returns true if user is member of the community', async () => {
        const {theCommunity, communityMember} = models;

        expect(await getCountOfPubsOrCollections(communityMember.id, theCommunity.id)).toEqual(true);
    });

    it('returns true if user is member of collection in the community', async () => {
        const { theCommunity, collectionUser} = models;
        expect(await getCountOfPubsOrCollections(collectionUser.id, theCommunity.id )).toEqual(true);
    });

    it('returns true if user is member of pub in the community', async () => {
        const {theCommunity, pubUser} = models;
        expect(await getCountOfPubsOrCollections(pubUser.id, theCommunity.id)).toEqual(true);
    });

    it('returns true if user has a CollectionAttribution in the community', async () => {
        const { theCommunity, collectionAttrUser} = models;
        expect(await getCountOfPubsOrCollections(collectionAttrUser.id, theCommunity.id )).toEqual(true);
    });

    it('returns true if user has a PubAttribution in the community', async () => {
        const {theCommunity, pubAttrUser} = models;
        expect(await getCountOfPubsOrCollections(pubAttrUser.id, theCommunity.id)).toEqual(true);
    });

    it('returns false if user is not in the community', async () => {
        const {theCommunity, notACommunityMember} = models;
        expect(await getCountOfPubsOrCollections(notACommunityMember.id, theCommunity.id)).toEqual(false);
    });

    it('returns false if user is an admin in another community but not in this community', async () => {
        const {theCommunity, randoCommunityAdmin} = models;
        expect(await getCountOfPubsOrCollections(randoCommunityAdmin.id, theCommunity.id)).toEqual(false);
    });
});
