const { Track, Artist, Album } = require('../models'); 
const responseHelper = require('../utils/responseHelper');

const getTracks = async (req, res) => {
    const limit = parseInt(req.query.limit) || 5; 
    const offset = parseInt(req.query.offset) || 0; 
    const artistId = req.query.artist_id; 
    const albumId = req.query.album_id; 
    const hidden = req.query.hidden; 

    try {
        const queryOptions = {
            where: {organization_id: req.user.organization_id},
            limit,
            offset,
            attributes: ['track_id', 'name', 'duration', 'hidden'],
            include: [
                {
                    model: Artist,
                    as: 'artist',
                    attributes: ['name'], 
                },
                {
                    model: Album,
                    as: 'album',
                    attributes: ['name'], 
                }
            ]
        };

        if (artistId) {
            queryOptions.where.artist_id = artistId; 
        }

        if (albumId) {
            queryOptions.where.album_id = albumId; 
        }

        if (hidden !== undefined) {
            queryOptions.where.hidden = hidden === 'true'; 
        }

        const tracks = await Track.findAll(queryOptions);

        const formattedTracks = tracks.map(track => ({
            track_id: track.track_id,
            name: track.name,
            duration: track.duration,
            hidden: track.hidden,
            artist_name: track.artist ? track.artist.name : null,
            album_name: track.album ? track.album.name : null,
        }));

        res.status(200).json(responseHelper.generateResponse(200, formattedTracks, "Tracks retrieved successfully.", null));
    } catch (error) {
        console.error(error);
        res.status(400).json(responseHelper.generateResponse(400, null, "Bad Request", null));
    }
};




const addTrack = async (req, res) => {
    const { name, duration, hidden, album_id, artist_id } = req.body;

    try {
        const artistExists = await Artist.findByPk(artist_id);
        const albumExists = await Album.findByPk(album_id);

        if (!artistExists) {
            return res.status(400).json(responseHelper.generateResponse(400, null, "Bad Request: Artist does not exist", null));
        }

        if (!albumExists) {
            return res.status(400).json(responseHelper.generateResponse(400, null, "Bad Request: Album does not exist", null));
        }

        const track = await Track.create({
            name,
            duration,
            hidden,
            album_id,
            artist_id,
            organization_id: req.user.organization_id,
            created_at: new Date()
        });

        res.status(201).json(responseHelper.generateResponse(201, null, "Track created successfully.", null));
    } catch (error) {
        console.error(error);
        res.status(500).json(responseHelper.generateResponse(500, null, "Something went wrong", error.message));
    }
};

const getTrackById = async (req, res) => {
    const trackId = req.params.track_id; 

    try {
        const track = await Track.findOne({ where: { track_id: trackId, organization_id: req.user.organization_id } });

        if (!track) {
            return res.status(404).json(responseHelper.generateResponse(404, null, "Resource Doesn't Exist", null));
        }

        res.status(200).json(responseHelper.generateResponse(200, track, "Track retrieved successfully.", null));
    } catch (error) {
        console.error(error);
        res.status(400).json(responseHelper.generateResponse(400, null, "Bad Request", null));
    }
};

const updateTrack = async (req, res) => {
    const trackId = req.params.track_id; 
    const { name, duration, hidden } = req.body; 

    try {
        const track = await Track.findOne({ where: { track_id: trackId, organization_id: req.user.organization_id } });
        if (!track) {
            return res.status(404).json(responseHelper.generateResponse(404, null, "Resource Doesn't Exist", null));
        }

        if (name !== undefined) {
            track.name = name;
        }
        if (duration !== undefined) {
            track.duration = duration;
        }
        if (hidden !== undefined) {
            track.hidden = hidden;
        }
        track.updated_at = new Date()
        await track.save();

        res.status(204).send(); 
    } catch (error) {
        console.error(error);
        res.status(400).json(responseHelper.generateResponse(400, null, 'Bad Request', null));
    }
};

const deleteTrack = async (req, res) => {
    const trackId = req.params.track_id; 

    try {
        const track = await Track.findOne({ where: { track_id: trackId, organization_id: req.user.organization_id } });
        if (!track) {
            return res.status(404).json(responseHelper.generateResponse(404, null, "Resource Doesn't Exist", null));
        }

        await Track.destroy({ where: { track_id: trackId } });

        res.status(200).json(responseHelper.generateResponse(200, null, `Track: ${track.name} deleted successfully.`, null));
    } catch (error) {
        console.error(error);
        res.status(400).json(responseHelper.generateResponse(400, null, "Bad Request", null));
    }
};

module.exports = { getTracks, addTrack, getTrackById, updateTrack, deleteTrack }; 