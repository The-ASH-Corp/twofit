import * as founderService from "./founder.model.js"

export const getDashboardData = async (req, res) => {
    try {
        const data = await founderService.getDashboardData();
        res.status(200).json({
            success: true,
            data: data,
        })
    } catch (error) {
        res.status(400).json({ success: false, message: err.message });
    }

}

