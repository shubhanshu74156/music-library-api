const Categories = require('../constants/categories');
const { Favorite, Track, Album, Artist } = require('../models'); 
const responseHelper = require('../utils/responseHelper');

const getFavorites = async (req, res) => {
    const category = req.params.category.toLowerCase(); 
    const limit = parseInt(req.query.limit) || 5; 
    const offset = parseInt(req.query.offset) || 0; 

    const validCategories = [Categories.ARTIST, Categories.ALBUM, Categories.TRACK];
    if (!validCategories.includes(category)) {
        return res.status(400).json(responseHelper.generateResponse(400, null, "Bad Request: Invalid category", null));
    }

    try {
        const queryOptions = {
            where: {
                user_id: req.user.user_id,
                category
            },
            limit,
            offset,
        };

        if (category === Categories.ARTIST) {
            queryOptions.include = [{
                model: Artist,
                as: 'artist', 
                attributes: ['name'], 
            }];
        } else if (category === Categories.ALBUM) {
            queryOptions.include = [{
                model: Album,
                as: 'album', 
                attributes: ['name'], 
            }];
        } else if (category === Categories.TRACK) {
            queryOptions.include = [{
                model: Track,
                as: 'track', 
                attributes: ['name'], 
            }];
        }

        const favorites = await Favorite.findAll(queryOptions);

        const formattedFavorites = favorites.map(favorite => ({
            favorite_id: favorite.favorite_id,
            category: favorite.category,
            item_id: favorite.item_id,
            name: favorite[category.toLowerCase()] ? favorite[category.toLowerCase()].name : null,
            created_at: favorite.createdAt,
        }));

        res.status(200).json(responseHelper.generateResponse(200, formattedFavorites, "Favorites retrieved successfully.", null));
    } catch (error) {
        console.error(error);
        res.status(500).json(responseHelper.generateResponse(500, null, "Internal Server Error", error.message));
    }
};

const addFavorite = async (req, res) => {
    const { category, item_id } = req.body;

    if (!category || !item_id) {
        return res.status(400).json(responseHelper.generateResponse(400, null, "Bad Request: Missing required fields", null));
    }

    const validCategories = [Categories.ARTIST, Categories.ALBUM, Categories.TRACK];
    if (!validCategories.includes(category)) {
        return res.status(400).json(responseHelper.generateResponse(400, null, "Bad Request: Invalid category", null));
    }

    try {
        const newFavorite = await Favorite.create({
            user_id: req.user.user_id, 
            category,
            item_id,
            created_at: new Date()
        });

        res.status(201).json(responseHelper.generateResponse(201, null, "Favorite added successfully.", null));
    } catch (error) {
        console.error(error);
        res.status(500).json(responseHelper.generateResponse(500, null, 'Something went wrong', error.message));
    }
};

const removeFavorite = async (req, res) => {
    const favoriteId = req.params.id; 

    try {
        const favorite = await Favorite.findOne({ where: { favorite_id: favoriteId, user_id: req.user.user_id } });
        if (!favorite) {
            return res.status(404).json(responseHelper.generateResponse(404, null, "Resource Doesn't Exist", null));
        }

        await Favorite.destroy({ where: { favorite_id: favoriteId } });

        res.status(200).json(responseHelper.generateResponse(200, null, "Favorite removed successfully.", null));
    } catch (error) {
        console.error(error);
        res.status(400).json(responseHelper.generateResponse(400, null, "Bad Request", null));
    }
};

module.exports = { addFavorite, getFavorites, removeFavorite };