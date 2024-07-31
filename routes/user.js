const { Router } = require("express");
const router = Router();

const { User, Course } = require("../db");

const userMiddleware = require("../middleware/user");

// User Routes
router.post('/signup',async (req, res) => {
    // Implement user signup logic
    const username=req.body.username;
    const password=req.body.password;

    await User.create({
        username:username,
        password:password
    })
    
    res.json({
        message: "User created successfully",
    })

});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const response= await Course.find({
        // Filter Lagao Course Having PRice Only 299 price:299
        //Showing Only Public Course isPublished:true
     });
     res.json(response);
});

router.post('/courses/:courseId', userMiddleware,async (req, res) => {
     // Implement course purchase logic
     const courseId = req.params.courseId;
     const username = req.headers.username;
    // Update the course status to purchased
    await User.updateOne({
        username: username
    },{
        "$push": {
            purchasedCourses: courseId,


        }
    })
    res.json({
        message: "Course purchased successfully",
    });

});

router.get('/purchasedCourses', userMiddleware,async (req, res) => {
    // Implement fetching purchased courses logic
    const user=await User.findOne({
        username: req.headers.username
    });
    const purchasedCourses=user.purchasedCourses;
    const courses = await Course.find({ _id: { $in: purchasedCourses } });
        res.json({ purchasedCourses, courses });
    res.json(purchasedCourses,courses);
});

module.exports = router