import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("rooms").collect();
  },
});

export const createRoom = mutation({
  args: { roomNumber: v.string(), host:v.string(), numOfPeople: v.number(), player: v.object({username: v.string(), isReady: v.boolean(), teamNumber: v.number(), isHost: v.boolean()})},
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("rooms", { roomNumber: args.roomNumber, host: args.host, numOfPeople: args.numOfPeople, players: [args.player]  });
    // do something with `taskId`
  },
});

export const joinRoom = mutation({
  args: { roomNumber: v.string()},
  handler: async(ctx, args) => {
    const room = await ctx.db
                  .query("rooms")
                  .filter((q) => q.eq(q.field("roomNumber"), args.roomNumber))
                  .collect();

    return room;
  }

})

export const addPlayerToRoom = mutation({
  args: { roomNumber: v.string(), player:v.object({username: v.string(), isReady: v.boolean(), teamNumber: v.number(), isHost: v.boolean()})},
  handler: async (ctx, args) => {
    const room = await ctx.db
    .query("rooms")
    .filter((q) => q.eq(q.field("roomNumber"), args.roomNumber))
    .unique();
    if (room !== null) {
      await ctx.db.patch(room._id, { numOfPeople: room.numOfPeople + 1, players: [...room.players, args.player] });
    }
    // do something with `taskId`
  },
})

export const getRoom = mutation({
  args: { roomNumber: v.string()},
  handler: async(ctx, args) => {
    const room = await ctx.db
                  .query("rooms")
                  .filter((q) => q.eq(q.field("roomNumber"), args.roomNumber))
                  .unique();

    return room?.players;
  }

})
export const getHost = mutation({
  args: { roomNumber: v.string()},
  handler: async(ctx, args) => {
    const room = await ctx.db
                  .query("rooms")
                  .filter((q) => q.eq(q.field("roomNumber"), args.roomNumber))
                  .unique();

    return room?.host;
  }

})

export const updateUserInRoom = mutation({
  args: { roomNumber: v.string(), players:v.array(v.object({username: v.string(), isReady: v.boolean(), teamNumber: v.number(), isHost: v.boolean()}))},
  handler: async (ctx, args) => {
    const room = await ctx.db
    .query("rooms")
    .filter((q) => q.eq(q.field("roomNumber"), args.roomNumber))
    .unique();
    if (room !== null) {
      await ctx.db.patch(room._id, { players: args.players });
    }
  
  },
})

export const deleteRoom = mutation({
  args: {roomNumber: v.string()},
  handler: async (ctx, args) => {
    const room = await ctx.db
    .query("rooms")
    .filter((q) => q.eq(q.field("roomNumber"), args.roomNumber))
    .unique();
    if (room != null) await ctx.db.delete(room?._id);
  }
})