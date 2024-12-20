const { Artist } = require('../models'); 
const responseHelper = require('../utils/responseHelper');

const getArtists = async (req, res) => {
    const limit = parseInt(req.query.limit) || 5; 
    const offset = parseInt(req.query.offset) || 0; 
    const grammy = req.query.grammy; 
    const hidden = req.query.hidden; 

    try {
        const queryOptions = {
            where: {organization_id: req.user.organization_id},
            limit,
            offset,
            attributes: ['artist_id', 'name', 'grammy', 'hidden'], 
        };

        if (grammy !== undefined) {
            if (grammy === '0' || grammy === '10') {
                queryOptions.where.grammy = grammy === '10' ? 10 : 0; 
            } else {
                return res.status(400).json(responseHelper.generateResponse(400, null, "Bad Request: Invalid Grammy value", null));
            }
        }

        if (hidden !== undefined) {
            queryOptions.where.hidden = hidden === 'true'; 
        }

        const artists = await Artist.findAll(queryOptions);

        res.status(200).json(responseHelper.generateResponse(200, artists, "Artists retrieved successfully.", null));
    } catch (error) {
        console.error(error);
        res.status(400).json(responseHelper.generateResponse(400, null, "Bad Request", null));
    }
};

const getArtistById = async (req, res) => {
    const artistId = req.params.artist_id; 
    try {
        const artist = await Artist.findOne({ where: { artist_id: artistId, organization_id: req.user.organization_id }, attributes: ['artist_id', 'name', 'grammy', 'hidden'],  });

        if (!artist) {
            return res.status(404).json(responseHelper.generateResponse(404, null, "Artist not found.", null));
        }

        res.status(200).json(responseHelper.generateResponse(200, artist, "Artist retrieved successfully.", null));
    } catch (error) {
        console.error(error);
        res.status(400).json(responseHelper.generateResponse(400, null, "Bad Request", null));
    }
};

const addArtist = async (req, res) => {
    const { name, grammy, hidden } = req.body;

    if (!name || grammy === undefined || hidden === undefined) {
        return res.status(400).json(responseHelper.generateResponse(400, null, "Bad Request: Missing required fields", null));
    }

    try {
        const newArtist = await Artist.create({
            name,
            grammy,
            hidden,
            organization_id: req.user.organization_id,
            created_at: new Date()
        });

        res.status(201).json(responseHelper.generateResponse(201, null, "Artist created successfully.", null));
    } catch (error) {
        console.error(error);
        res.status(500).json(responseHelper.generateResponse(500, null, 'Something went wrong', error.message));
    }
};

const updateArtist = async (req, res) => {
    const artistId = req.params.artist_id; 
    const { name, grammy, hidden } = req.body; 

    try {
        const artist = await Artist.findOne({ where: { artist_id: artistId, organization_id: req.user.organization_id } });
        if (!artist) {
            return res.status(404).json(responseHelper.generateResponse(404, null, "Artist not found.", null));
        }

        if (name !== undefined) {
            artist.name = name;
        }
        if (grammy !== undefined) {
            artist.grammy = grammy;
        }
        if (hidden !== undefined) {
            artist.hidden = hidden;
        }
        artist.updated_at = new Date()
        await artist.save();

        res.status(204).send(); 
    } catch (error) {
        console.error(error);
        res.status(400).json(responseHelper.generateResponse(400, null, 'Bad Request', null));
    }
};

const deleteArtist = async (req, res) => {
    const artistId = req.params.artist_id; 

    try {
        const artist = await Artist.findOne({ where: { artist_id: artistId, organization_id: req.user.organization_id } });
        if (!artist) {
            return res.status(404).json(responseHelper.generateResponse(404, null, "Artist not found.", null));
        }

        await Artist.destroy({ where: { artist_id: artistId } });

        res.status(200).json(responseHelper.generateResponse(200, { artist_id: artistId }, `Artist: ${artist.name} deleted successfully.`, null));
    } catch (error) {
        console.error(error);
        res.status(400).json(responseHelper.generateResponse(400, null, "Bad Request", null));
    }
};

module.exports = { getArtists, getArtistById, addArtist, updateArtist, deleteArtist };
