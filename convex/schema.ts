import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";



export default defineSchema({
  rooms: defineTable({
    roomNumber: v.string(),
    numOfPeople: v.number(),
    host: v.string(),
    players: v.array(v.object({username: v.string(), isReady: v.boolean(), teamNumber: v.number(), isHost: v.boolean()}))
  }),
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    roomNumber: v.string()
  }).index("by_token", ["tokenIdentifier"]),
 
});