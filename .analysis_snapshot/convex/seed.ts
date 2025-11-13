import { mutation } from "./_generated/server";

// Seed the draftablePlayers table with NHL hockey players
export const seedDraftablePlayers = mutation({
    args: {},
    handler: async (ctx) => {
        // Check if players already exist
        const existingPlayers = await ctx.db.query("draftablePlayers").collect();
        if (existingPlayers.length > 0) {
            return { message: "Players already seeded", count: existingPlayers.length };
        }

        const players = [
            // Forwards
            { name: "Connor McDavid", position: "C", avatar: "https://assets.nhle.com/mugs/nhl/latest/8478402.png" },
            { name: "Auston Matthews", position: "C", avatar: "https://assets.nhle.com/mugs/nhl/latest/8479318.png" },
            { name: "Nathan MacKinnon", position: "C", avatar: "https://assets.nhle.com/mugs/nhl/latest/8477492.png" },
            { name: "Leon Draisaitl", position: "C", avatar: "https://assets.nhle.com/mugs/nhl/latest/8477934.png" },
            { name: "Sidney Crosby", position: "C", avatar: "https://assets.nhle.com/mugs/nhl/latest/8471675.png" },
            { name: "David Pastrnak", position: "RW", avatar: "https://assets.nhle.com/mugs/nhl/latest/8477956.png" },
            { name: "Nikita Kucherov", position: "RW", avatar: "https://assets.nhle.com/mugs/nhl/latest/8476453.png" },
            { name: "Matthew Tkachuk", position: "LW", avatar: "https://assets.nhle.com/mugs/nhl/latest/8479314.png" },
            { name: "Artemi Panarin", position: "LW", avatar: "https://assets.nhle.com/mugs/nhl/latest/8478550.png" },
            { name: "Mikko Rantanen", position: "RW", avatar: "https://assets.nhle.com/mugs/nhl/latest/8478420.png" },
            { name: "Jack Eichel", position: "C", avatar: "https://assets.nhle.com/mugs/nhl/latest/8478403.png" },
            { name: "Elias Pettersson", position: "C", avatar: "https://assets.nhle.com/mugs/nhl/latest/8481539.png" },
            { name: "Kirill Kaprizov", position: "LW", avatar: "https://assets.nhle.com/mugs/nhl/latest/8478864.png" },
            { name: "Jason Robertson", position: "LW", avatar: "https://assets.nhle.com/mugs/nhl/latest/8480027.png" },
            { name: "Mitch Marner", position: "RW", avatar: "https://assets.nhle.com/mugs/nhl/latest/8478483.png" },
            { name: "Alex Ovechkin", position: "LW", avatar: "https://assets.nhle.com/mugs/nhl/latest/8471214.png" },
            { name: "Brad Marchand", position: "LW", avatar: "https://assets.nhle.com/mugs/nhl/latest/8473419.png" },
            { name: "Sebastian Aho", position: "C", avatar: "https://assets.nhle.com/mugs/nhl/latest/8478427.png" },
            { name: "J.T. Miller", position: "C", avatar: "https://assets.nhle.com/mugs/nhl/latest/8476468.png" },
            { name: "Kyle Connor", position: "LW", avatar: "https://assets.nhle.com/mugs/nhl/latest/8478398.png" },

            // Defensemen
            { name: "Cale Makar", position: "D", avatar: "https://assets.nhle.com/mugs/nhl/latest/8480069.png" },
            { name: "Roman Josi", position: "D", avatar: "https://assets.nhle.com/mugs/nhl/latest/8474600.png" },
            { name: "Quinn Hughes", position: "D", avatar: "https://assets.nhle.com/mugs/nhl/latest/8480800.png" },
            { name: "Adam Fox", position: "D", avatar: "https://assets.nhle.com/mugs/nhl/latest/8479323.png" },
            { name: "Victor Hedman", position: "D", avatar: "https://assets.nhle.com/mugs/nhl/latest/8475167.png" },
            { name: "Moritz Seider", position: "D", avatar: "https://assets.nhle.com/mugs/nhl/latest/8481542.png" },
            { name: "Evan Bouchard", position: "D", avatar: "https://assets.nhle.com/mugs/nhl/latest/8480803.png" },
            { name: "Josh Morrissey", position: "D", avatar: "https://assets.nhle.com/mugs/nhl/latest/8477504.png" },
            { name: "Dougie Hamilton", position: "D", avatar: "https://assets.nhle.com/mugs/nhl/latest/8476462.png" },
            { name: "Miro Heiskanen", position: "D", avatar: "https://assets.nhle.com/mugs/nhl/latest/8480036.png" },
            { name: "Charlie McAvoy", position: "D", avatar: "https://assets.nhle.com/mugs/nhl/latest/8479325.png" },
            { name: "Devon Toews", position: "D", avatar: "https://assets.nhle.com/mugs/nhl/latest/8478438.png" },
            { name: "Aaron Ekblad", position: "D", avatar: "https://assets.nhle.com/mugs/nhl/latest/8477932.png" },
            { name: "Rasmus Dahlin", position: "D", avatar: "https://assets.nhle.com/mugs/nhl/latest/8480839.png" },
            { name: "Thomas Chabot", position: "D", avatar: "https://assets.nhle.com/mugs/nhl/latest/8479975.png" },

            // Goalies
            { name: "Connor Hellebuyck", position: "G", avatar: "https://assets.nhle.com/mugs/nhl/latest/8476945.png" },
            { name: "Igor Shesterkin", position: "G", avatar: "https://assets.nhle.com/mugs/nhl/latest/8478048.png" },
            { name: "Andrei Vasilevskiy", position: "G", avatar: "https://assets.nhle.com/mugs/nhl/latest/8476883.png" },
            { name: "Juuse Saros", position: "G", avatar: "https://assets.nhle.com/mugs/nhl/latest/8477424.png" },
            { name: "Ilya Sorokin", position: "G", avatar: "https://assets.nhle.com/mugs/nhl/latest/8478009.png" },
            { name: "Jake Oettinger", position: "G", avatar: "https://assets.nhle.com/mugs/nhl/latest/8479979.png" },
            { name: "Jeremy Swayman", position: "G", avatar: "https://assets.nhle.com/mugs/nhl/latest/8480280.png" },
            { name: "Alexandar Georgiev", position: "G", avatar: "https://assets.nhle.com/mugs/nhl/latest/8478027.png" },
            { name: "Linus Ullmark", position: "G", avatar: "https://assets.nhle.com/mugs/nhl/latest/8476999.png" },
            { name: "Frederik Andersen", position: "G", avatar: "https://assets.nhle.com/mugs/nhl/latest/8475883.png" },
        ];

        const insertedPlayers = [];
        for (const player of players) {
            const id = await ctx.db.insert("draftablePlayers", player);
            insertedPlayers.push(id);
        }

        return {
            message: "Successfully seeded draftable players",
            count: insertedPlayers.length,
            playerIds: insertedPlayers,
        };
    },
});

// Clear all players (useful for development/testing)
export const clearDraftablePlayers = mutation({
    args: {},
    handler: async (ctx) => {
        const players = await ctx.db.query("draftablePlayers").collect();
        for (const player of players) {
            await ctx.db.delete(player._id);
        }
        return { message: "All players cleared", count: players.length };
    },
});

