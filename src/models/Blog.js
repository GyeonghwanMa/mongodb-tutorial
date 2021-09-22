const { Schema, model, Types } = require('mongoose');

const BlogSchema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    islive: {type: Boolean, required: true, default: false},
    user: {type: Types.ObjectId, required: true, ref: 'user'},
}, {timestamps: true});

// virtual populate
BlogSchema.virtual('comments', {
    ref: 'comment',
    localField: '_id',
    foreignField: 'blog'
});

// db에는 저장 안됨
BlogSchema.set('toObject', {virtuals: true});
BlogSchema.set('toJSON', {virtuals: true});

const Blog = model('blog', BlogSchema);

module.exports = {Blog};