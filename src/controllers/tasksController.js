exports.getAll = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tasks: [
                {
                    id: 1,
                    name: "Documentar api's"
                }
            ]
        }
    })
}