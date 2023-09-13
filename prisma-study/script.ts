import { PrismaClient } from '@prisma/client'
import express from 'express'
const app = express();
const port = 3000;
let bodyParser = require('body-parser');

const prisma = new PrismaClient()

async function main() {
    app.use(bodyParser.json({ extended: false }));

    app.route("/users")
    .get(async (req, res) => {
        const users = await prisma.user.findMany();
        res.json(users);
    })
    .post(async (req, res) => {
        const newUser = req.body
        try {
            await prisma.user.create({
                data: newUser
            })
            res.json(newUser);
        } catch (error) {
            res.status(418).send(error);
        }
    })
    .put(async (req, res) => {
    })
    .delete(async (req, res) => {
        const email = req.body.email
        if (email) {
            try {
                const user = await prisma.user.delete({
                    where: {
                        email: email
                    }
                });
                res.json(user);
            } catch (error) {
                res.status(418).send(error);
            }
        } else {
            res.sendStatus(400);
        }
    });

    app.route("/posts")
    .get(async (req, res) => {
        const posts = await prisma.post.findMany();
        res.json(posts);
    })
    .post(async (req, res) => {
        const newPost = req.body
        const author = newPost.author
        delete newPost.author
        try {
            await prisma.post.create({
                data: {
                    ...newPost,
                    author: {
                        connect: {id: author.id}
                    }
                }
            });
            res.json(newPost);
        } catch (error) {
            res.status(418).send(error);
        }
    })
    .put(async (req, res) => {
    })
    .delete(async (req, res) => {
        const id = req.body.id
        if (id) {
            try {
                const post = await prisma.post.delete({
                    where: {
                        id: id
                    }
                });
                res.json(post);
            } catch (error) {
                res.status(418).send(error);
            }
        } else {
            res.sendStatus(400);
        }
    });

    app.listen(port, () => console.log("Server started"));
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })