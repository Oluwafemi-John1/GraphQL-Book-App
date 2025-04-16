const graphql = require('graphql')
const { GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } = graphql
const _ = require('lodash')
const bookModel = require('../models/bookModel')
const authorModel = require('../models/authorModel')

const books = [
    { id: 1, name: 'Name of the Wind', genre: 'Fantasy', authorId: 1 },
    { id: 2, name: 'The Final Empire', genre: 'Fantasy', authorId: 2 },
    { id: 3, name: 'The Long Earth', genre: 'Sci-Fi', authorId: 3 },
    { id: 4, name: 'The Hero of Ages', genre: 'Fantasy', authorId: 4 },
    { id: 5, name: 'The Colour of Magic', genre: 'Fantasy', authorId: 5 },
    { id: 6, name: 'The Light Fantastic', genre: 'Fantasy', authorId: 6 },
    { id: 7, name: 'The Shepherd\'s Crown', genre: 'Fantasy', authorId: 1 },
    { id: 8, name: 'The Amazing Maurice and His Educated Rodents', genre: 'Fantasy', authorId: 2 },
    { id: 9, name: 'The Disc world Companion', genre: 'Fantasy', authorId: 1 },
    { id: 10, name: 'The Disc world Almanak', genre: 'Fantasy', authorId: 2 },
    { id: 11, name: 'The Disc world Graphic Novels', genre: 'Fantasy', authorId: 5 },
    { id: 12, name: 'The Disc world Mapp', genre: 'Fantasy', authorId: 2 },
    { id: 13, name: 'The Disc world Atlas', genre: 'Fantasy', authorId: 1 },
    { id: 14, name: 'The Disc world Diaries', genre: 'Fantasy', authorId: 2 },
    { id: 15, name: 'The Disc world Calendar', genre: 'Fantasy', authorId: 3 },
]

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorId: {type: GraphQLID},
        author: {
            type: AuthorType,
            resolve(parent, args) {
                // console.log(parent);
                // return _.find(authors, { id: parent.authorId })
                return authorModel.findById(parent.authorId)
            }
        }
    })
})

const authors = [
    { id: 1, name: 'Ayodeji Muraina', age: 10, nationality: 'Nigeria' },
    { id: 2, name: 'Chimamanda Adichie', age: 45, nationality: 'Nigeria' },
    { id: 3, name: 'J.K. Rowling', age: 57, nationality: 'United Kingdom' },
    { id: 4, name: 'George R.R. Martin', age: 74, nationality: 'United States' },
    { id: 5, name: 'Brandon Sanderson', age: 48, nationality: 'United States' },
    { id: 6, name: 'Terry Pratchett', age: 66, nationality: 'United Kingdom' }
]

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        nationality: { type: GraphQLString },
        book: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                console.log(parent);
                // return _.filter(books, { authorId: parent.id })
                return bookModel.find({authorId: parent.id})
            }
        }
    })
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                nationality: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args) {
                try {
                    let author = new authorModel({
                        name: args.name,
                        age: args.age,
                        nationality: args.nationality
                    });
                    console.log('author saved');
                    return await author.save();
                } catch (err) {
                    console.log(err);
                }
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            async resolve(parent, args) {
                try {
                    let book = new bookModel({
                        name: args.name,
                        genre: args.genre,
                        authorId: args.authorId
                    })
                    return await book.save();
                } catch (err) {
                    console.log(err);
                }
            }
        }
    }
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return _.find(books, { id: args.id })
                return bookModel.findById(args.id)
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return _.find(authors, { id: args.id })
                return authorModel.findById(args.id)
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return books
                return bookModel.find({})
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                // return authors
                return authorModel.find({})
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})