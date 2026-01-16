import * as founderService from "./founder.services.js"

export const getDashboardData = async (req, res) => {
    try {
        const data = await founderService.getDashboardData();
        // console.log(data)
        res.status(200).json({
            success: true,
            data: data,
        })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }

}

