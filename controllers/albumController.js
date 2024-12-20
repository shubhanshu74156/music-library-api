const { Album, Artist } = require('../models'); 
const responseHelper = require('../utils/responseHelper');

const getAlbums = async (req, res) => {
    const limit = parseInt(req.query.limit) || 5; 
    const offset = parseInt(req.query.offset) || 0; 
    const artistId = req.query.artist_id; 
    const hidden = req.query.hidden; 

    try {
        const queryOptions = {
            where: {organization_id: req.user.organization_id},
            limit,
            offset,
            attributes: ['album_id', 'name', 'year', 'hidden'], 
            include: [{
                model: Artist,
                as: 'artist', 
                attributes: ['name'], 
            }]
        };

        if (artistId) {
            queryOptions.where.artist_id = artistId; 
        }

        if (hidden !== undefined) {
            queryOptions.where.hidden = hidden === 'true'; 
        }

        const albums = await Album.findAll(queryOptions);

        const formattedAlbums = albums.map(album => ({
            album_id: album.album_id,
            artist_name: album.artist ? album.artist.name : null, 
            name: album.name,
            year: album.year,
            hidden: album.hidden,
        }));

        res.status(200).json(responseHelper.generateResponse(200, formattedAlbums, "Albums retrieved successfully.", null));
    } catch (error) {
        console.error(error);
        res.status(400).json(responseHelper.generateResponse(400, null, "Bad Request", null));
    }
};


const getAlbumById = async (req, res) => {
    const albumId = req.params.album_id; 
    try {
        const album = await Album.findOne({
            where: { album_id: albumId, organization_id: req.user.organization_id },
            attributes: ['album_id', 'name', 'year', 'hidden'],
            include: [{
                model: Artist, 
                as: 'artist', 
                attributes: ['name'], 
            }]
        });

        if (!album) {
            return res.status(404).json(responseHelper.generateResponse(404, null, "Resource Doesn't Exist", null));
        }

        const formattedAlbum = {
            album_id: album.album_id,
            artist_name: album.artist ? album.artist.name : null, 
            name: album.name,
            year: album.year,
            hidden: album.hidden,
        };

        res.status(200).json(responseHelper.generateResponse(200, formattedAlbum, "Album retrieved successfully.", null));
    } catch (error) {
        console.error(error);
        res.status(400).json(responseHelper.generateResponse(400, null, "Bad Request", null));
    }
};


const addAlbum = async (req, res) => {
    const { artist_id, name, year, hidden } = req.body;

    if (!artist_id || !name || year === undefined || hidden === undefined) {
        return res.status(400).json(responseHelper.generateResponse(400, null, "Bad Request: Missing required fields", null));
    }

    try {
        const newAlbum = await Album.create({
            artist_id,
            name,
            year,
            hidden,
            organization_id: req.user.organization_id,
            created_at: new Date()
        });

        res.status(201).json(responseHelper.generateResponse(201, null, "Album created successfully.", null));
    } catch (error) {
        console.error(error);
        res.status(500).json(responseHelper.generateResponse(500, null, 'Something went wrong', error.message));
    }
};

const updateAlbum = async (req, res) => {
    const albumId = req.params.album_id; 
    const { name, year, hidden } = req.body; 

    try {
        const album = await Album.findOne({ where: { album_id: albumId, organization_id: req.user.organization_id } });
        if (!album) {
            return res.status(404).json(responseHelper.generateResponse(404, null, "Resource Doesn't Exist", null));
        }

        if (name !== undefined) {
            album.name = name;
        }
        if (year !== undefined) {
            album.year = year;
        }
        if (hidden !== undefined) {
            album.hidden = hidden;
        }
        album.updated_at = new Date()
        await album.save();

        res.status(204).send(); 
    } catch (error) {
        console.error(error);
        res.status(400).json(responseHelper.generateResponse(400, null, 'Bad Request', null));
    }
};

const deleteAlbum = async (req, res) => {
    const albumId = req.params.album_id; 

    try {
        const album = await Album.findOne({ where: { album_id: albumId, organization_id: req.user.organization_id } });
        if (!album) {
            return res.status(404).json(responseHelper.generateResponse(404, null, "Resource Doesn't Exist", null));
        }

        await Album.destroy({ where: { album_id: albumId } });

        res.status(200).json(responseHelper.generateResponse(200, null, `Album: ${album.name} deleted successfully.`, null));
    } catch (error) {
        console.error(error);
        res.status(400).json(responseHelper.generateResponse(400, null, "Bad Request", null));
    }
};

module.exports = { getAlbums, getAlbumById, addAlbum, updateAlbum, deleteAlbum };
