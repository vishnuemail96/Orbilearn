import React, { useEffect, useRef, useState } from "react";
import { getCourseList } from "../services/courseListApi";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const hasFetched = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    setLoading(true);
    getCourseList()
      .then((response) => {
        console.log("Course Data:", response.data);
        const coursesData = response.data;
        setCourses(coursesData);

        // Extract and set unique categories
        const extractedCategories = extractCategories(coursesData);
        setCategories(extractedCategories);

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses");
        setLoading(false);
      });
  }, []);

  // Function to extract course categories based on patterns in titles
  const extractCategories = (coursesData) => {
    // Default categories
    const defaultCategories = [
      "all",
      "programming",
      "data",
      "cloud",
      "testing",
    ];

    // You can enhance this logic based on your actual data structure
    // For now, we're inferring categories from the course titles
    const categoryMap = {
      Python: "programming",
      Java: "programming",
      "Full Stack": "programming",
      Datascience: "data",
      AWS: "cloud",
      "Amazon Web Services": "cloud",
      DevOps: "cloud",
      Testing: "testing",
    };

    // Check if each default category has at least one course
    const availableCategories = defaultCategories.filter((category) => {
      if (category === "all") return true;

      return coursesData.some((course) => {
        for (const [keyword, cat] of Object.entries(categoryMap)) {
          if (cat === category && course.title.includes(keyword)) {
            return true;
          }
        }
        return false;
      });
    });

    return availableCategories;
  };

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const getFilteredCourses = () => {
    if (activeCategory === "all") return courses;

    return courses.filter((course) => {
      const title = course.title.toLowerCase();

      // Filter logic based on category
      switch (activeCategory) {
        case "programming":
          return (
            title.includes("java") ||
            title.includes("python") ||
            title.includes("full stack")
          );
        case "data":
          return title.includes("data") || title.includes("datascience");
        case "cloud":
          return (
            title.includes("aws") ||
            title.includes("amazon") ||
            title.includes("devops")
          );
        case "testing":
          return title.includes("testing");
        default:
          return true;
      }
    });
  };

  if (loading)
    return (
      <div className="text-center p-8">
        <span className="loading loading-ring loading-xs text-secondary"></span>
        <span className="loading loading-ring loading-sm text-secondary"></span>
        <span className="loading loading-ring loading-md text-secondary"></span>
        <span className="loading loading-ring loading-lg text-secondary"></span>
        <span className="loading loading-ring loading-xl text-secondary"></span>
      </div>
    );
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (courses.length === 0)
    return <div className="text-center p-8">No courses available</div>;

  const filteredCourses = getFilteredCourses();

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#146C94]">
        Available Courses
      </h1>

      {/* Category Tabs */}
      <div className="tabs tabs-boxed mb-10">
        {categories.map((category) => (
          <button
            key={category}
            className={`tab ${activeCategory === category ? "tab-active" : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Course Cards */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 space-y-7">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              data={course}
              onClick={() => handleCourseClick(course.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-8">
          No courses available in this category
        </div>
      )}
    </div>
  );
};

export default Courses;
