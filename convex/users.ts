import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this identity before.
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (user !== null) {
      // If we've seen this identity before but the name has changed, patch the value.
      if (user.name !== identity.name) {
        await ctx.db.patch(user._id, { name: identity.name });
      }
      return user._id;
    }
    // If it's a new identity, create a new `User`.
    return await ctx.db.insert("users", {
      name: identity.name!,
      tokenIdentifier: identity.tokenIdentifier,
      roomNumber: ''
    });
  },
});

export const getUserRoom = mutation({
  args: {},
  handler: async (ctx) => {
    const userInfo = {roomNumber: '', id: '' }
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this identity before.
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (user !== null) {
      // If we've seen this identity before but the name has changed, patch the value.
      if (user.name !== identity.name) {
        await ctx.db.patch(user._id, { name: identity.name });
      }
      userInfo.roomNumber = user.roomNumber;
      userInfo.id = user._id;
      return userInfo;
    }
    // If it's a new identity, create a new `User`.
    userInfo.id = await ctx.db.insert("users", {
      name: identity.name!,
      tokenIdentifier: identity.tokenIdentifier,
      roomNumber: ''
    });
    return userInfo;
  },
});



export const updateUserRoom = mutation({
  args: { id: v.id("users"), roomNumber: v.string() },
  handler: async (ctx, args) => {
    const { id } = args;

    // Add `tag` and overwrite `status`:
    console.log(args.roomNumber)
    await ctx.db.patch(id, { roomNumber: args.roomNumber });
  },
});