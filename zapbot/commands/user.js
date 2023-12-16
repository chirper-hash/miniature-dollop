const { Composer } = require('grammy');
const sqlite3 = require('sqlite3').verbose();
const config = require('../config');

const userMiddleware = new Composer();

userMiddleware.command('user', async (ctx) => {
    const [cmd, mention] = user ? user.text : null;

    if (cmd === 'add' || cmd === 'delete' || cmd === 'info' || cmd === 'setadmin') {
        const user = ctx.message.mentions && ctx.message.mentions.users && ctx.message.mentions.users.first();
        const member = ctx.message.guild.member(user);

        if (!user) {
            return ctx.reply('You didn\'t mention the user. Example: /user add @user');
        }
        if (member) {
            const { id, username, discriminator } = user;
            const date = Date.now();

            const db = new sqlite3.Database('./db/data.db');

            try {
                switch (cmd) {
                    case 'add':
                        if (await userExists(db, id)) {
                            return ctx.reply(`@${username} is already in the database.`);
                        }

                        const addRole = ctx.message.guild.roles.cache.find(r => r.name === config.botuser_rolename);
                        await member.roles.add(addRole);

                        await addUserToDB(db, id, username, discriminator, date, 1);
                        return ctx.reply(`@${username} has been added to the database.`);

                    case 'delete':
                        if (!(await userExists(db, id))) {
                            return ctx.reply(`@${username} is not in the database.`);
                        }

                        const deleteRole = ctx.message.guild.roles.cache.find(r => r.name === config.botuser_rolename);
                        await member.roles.remove(deleteRole);

                        const deleteAdminRole = ctx.message.guild.roles.cache.find(r => r.name === config.admin_rolename);
                        await member.roles.remove(deleteAdminRole);

                        await deleteUserFromDB(db, id);
                        return ctx.reply(`@${username} has been deleted from the database.`);

                    case 'info':
                        const userRow = await getUserRow(db, id);
                        if (userRow) {
                            const rank = userRow.permissions === 0 ? 'admin' : 'a normal user';
                            return ctx.reply(`Information about ${username}: ${username} is ${rank}. They can use the bot.`);
                        } else {
                            return ctx.reply(`@${username} is not in the database.`);
                        }

                    case 'setadmin':
                        const setAdminRow = await getUserRow(db, id);
                        const userRole = ctx.message.guild.roles.cache.find(r => r.name === config.botuser_rolename);
                        await member.roles.remove(userRole);

                        const adminRole = ctx.message.guild.roles.cache.find(r => r.name === config.admin_rolename);
                        await member.roles.add(adminRole);

                        if (setAdminRow) {
                            if (setAdminRow.permissions === 0) {
                                return ctx.reply(`@${username} is already an admin.`);
                            } else {
                                await updateUserRankToAdmin(db, id);
                                return ctx.reply(`@${username} is now an admin.`);
                            }
                        } else {
                            await addUserToDB(db, id, username, discriminator, date, 0);
                            return ctx.reply(`@${username} has been added to the database as an admin.`);
                        }

                    default:
                        return ctx.reply('Invalid command. Example: /user add @example');
                }
            } catch (error) {
                console.error(error);
                return ctx.reply('An error occurred while processing your request.');
            } finally {
                db.close();
            }
        } else {
            return ctx.reply(`User ${mention} is not on your server or wasn't found.`);
        }
    } else {
        return ctx.reply('Invalid command. Example: /user add @example');
    }
});

async function userExists(db, userid) {
    return new Promise((resolve, reject) => {
        db.get('SELECT userid FROM users WHERE userid = ?', [userid], (err, row) => {
            if (err) reject(err);
            else resolve(row !== undefined);
        });
    });
}

async function getUserRow(db, userid) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE userid = ?', [userid], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

async function addUserToDB(db, userid, username, discriminator, date, permissions) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO users(userid, username, discriminator, date, permissions) VALUES(?, ?, ?, ?, ?)',
            [userid, username, discriminator, date, permissions],
            (err) => {
                if (err) reject(err);
                else resolve();
            }
        );
    });
}

async function deleteUserFromDB(db, userid) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM users WHERE userid = ?', [userid], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

async function updateUserRankToAdmin(db, userid) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE users SET permissions = ? WHERE userid = ?', [0, userid], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}
// Add the following try-catch block within your middleware
try {
    // Your existing middleware logic here

} catch (err) {
    console.error(`Error in userMiddleware: ${err.message}`);
}
module.exports = userMiddleware;
