import { modelize } from 'stubstub';

export const models = modelize`
    Community community {
        Pub p1 {
            customPublishedAt: "2020-01-03"
        } 
        Pub p2 {
            Release {
                createdAt: "2020-02-05"
            }
        }
        Pub p3 {
            Release {
                createdAt: "2020-03-09"
            }
        }
        Pub p4 {
            customPublishedAt: "2020-04-15"
            Release {
                createdAt: "2020-08-15"
            }
            outboundEdges: PubEdge {
                relationType: "review"
                pubIsParent: true
                approvedByTarget: true
                rank: "0"
                targetPub: p2
            }
        }
        Pub p5 {
            Release {
                createdAt: "2020-05-26"
            }
        }
        Pub p6 {
            outboundEdges: PubEdge {
                relationType: "review"
                pubIsParent: true
                approvedByTarget: true
                rank: "0"
                targetPub: p2
            }
        }
        Collection c1 {
            CollectionPub {
                rank: "0"
                p1
            }
            CollectionPub {
                rank: "1"
                p2
            }
            CollectionPub {
                rank: "2"
                p3
            }
        }
        Collection c2 {
            CollectionPub {
                rank: "0"
                p2
            }
            CollectionPub {
                rank: "1"
                p3
            }
            CollectionPub cp2 {
                rank: "2"
                p4
            }
        }
        Collection c3 {
            CollectionPub {
                rank: "0"
                p3
            }
            CollectionPub {
                rank: "1"
                p4
            }
            CollectionPub {
                rank: "2"
                p5
            }
        }
    }
`;
