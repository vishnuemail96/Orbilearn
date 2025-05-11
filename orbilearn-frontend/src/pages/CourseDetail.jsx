import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseDetailsById } from "../services/courseDetailsApi";
import {
  BookOpen,
  Calendar,
  Users,
  HelpCircle,
  Award,
  Star,
  IndianRupee,
  Clock,
  ChevronRight,
  CheckCircle,
  Code,
  Wrench,
  BarChart2,
  Monitor,
  Download,
} from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    setLoading(true);
    getCourseDetailsById(id)
      .then((response) => {
        console.log(response)
        setCourse(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching course details:", error);
        setError("Failed to load course details");
        setLoading(false);
      });
  }, [id]);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="alert alert-error max-w-md">
          <span>{error}</span>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary btn-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  if (!course)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="alert alert-warning max-w-md">
          <span>Course not found</span>
          <button
            onClick={() => window.history.back()}
            className="btn btn-primary btn-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  const renderAboutTab = () => (
    <div>
      <h2 className="text-3xl font-bold mb-6">About Course</h2>
      <div className="space-y-6">
        {/* Description */}
        <div className="flex items-start gap-4 mb-6">
          <div className="min-w-8 mt-1">
            <div className="w-8 h-8 bg-primary flex items-center justify-center rounded">
              <BookOpen className="w-5 h-5 text-primary-content" />
            </div>
          </div>
          <div>
            <p className="text-lg">{course.description}</p>
          </div>
        </div>

        {/* Objectives */}
        {course.objectives && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-primary flex gap-2">
                <Award className="text-secondary" size={20} />
                Learning Objectives
              </h3>
              <ul className="space-y-2 mt-2">
                {course.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="text-accent mt-1 h-5 w-5 flex-shrink-0" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Skills & Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Skills Covered */}
          {course.skills_covered && (
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-primary flex gap-2">
                  <Code className="text-secondary" size={20} />
                  Skills Covered
                </h3>
                <div className="">
                  {course.skills_covered.map((skill, index) => (
                    <span
                      key={index}
                      className="alert alert-primary mb-1 alert-soft"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tools Covered */}
          {course.tools_covered && (
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-primary flex gap-2">
                  <Wrench className="text-secondary" size={20} />
                  Tools Covered
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {course.tools_covered.map((tool, index) => (
                    <span
                      key={index}
                      className="badge badge-secondary badge-outline p-3"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Career Opportunities & Target Audience */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Career Opportunities */}
          {course.designations && (
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-primary flex gap-2">
                  <BarChart2 className="text-secondary" size={20} />
                  Career Opportunities
                </h3>
                <ul className="mt-2 space-y-2">
                  {course.designations.map((designation, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                      <span>{designation}</span>
                    </li>
                  ))}
                </ul>
                {course.average_package && (
                  <marquee>
                    <div className="mt-4 flex gap-2">
                      <div className="stat bg-base-200 rounded-lg p-2">
                        <div className="stat-title">Average Package</div>
                        <div className="stat-value text-success text-lg">
                          {course.average_package.package}
                        </div>
                      </div>

                      <div className="stat bg-base-200 rounded-lg p-2">
                        <div className="stat-title">Salary Growth</div>
                        <div className="stat-value text-info text-lg">
                          {course.average_package.salary_hike}
                        </div>
                      </div>
                    </div>
                  </marquee>
                )}
              </div>
            </div>
          )}

          {/* Target Audience */}
          {course.target_audience && (
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-primary flex gap-2">
                  <Users className="text-secondary" size={20} />
                  Target Audience
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {course.target_audience.map((audience, index) => (
                    <span key={index} className="badge badge-info p-3">
                      {audience}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Prerequisites */}
        {course.prerequisites && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-primary flex gap-2">
                <CheckCircle className="text-secondary" size={20} />
                Prerequisites
              </h3>
              <ul className="space-y-2 mt-2">
                {course.prerequisites.map((prerequisite, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="text-accent mt-1 h-5 w-5 flex-shrink-0" />
                    <span>{prerequisite}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Why Enroll */}
        {course.why_enroll_for_this_training && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-primary flex gap-2">
                <Award className="text-secondary" size={20} />
                Why Enroll For This Training
              </h3>
              <ul className="space-y-2 mt-2">
                {course.why_enroll_for_this_training.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="text-accent mt-1 h-5 w-5 flex-shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Training Features */}
        {course.training_features && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-primary flex gap-2 mb-4">
                <Award className="text-secondary" size={20} />
                Training Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {course.training_features.map((feature, index) => (
                  <div key={index} className="card bg-base-200 shadow">
                    <div className="card-body p-4">
                      <h4 className="text-lg font-medium text-primary">
                        {feature.title}
                      </h4>
                      <ul className="space-y-2 mt-2">
                        {feature.point1 && (
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature.point1}</span>
                          </li>
                        )}
                        {feature.point2 && (
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature.point2}</span>
                          </li>
                        )}
                        {feature.point3 && (
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature.point3}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Assessment Methods */}
        {course.assessment_methods && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-primary flex gap-2">
                <CheckCircle className="text-secondary" size={20} />
                Assessment Methods
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {course.assessment_methods.map((method, index) => (
                  <span key={index} className="badge badge-accent p-3">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCurriculumTab = () => (
    <div>
      <h2 className="text-3xl font-bold mb-6">Course Curriculum</h2>
      <div className="space-y-4">
        {course.curriculum &&
          Object.entries(course.curriculum).map(([section, topics], index) => (
            <div
              key={index}
              className="collapse collapse-arrow bg-base-100 shadow"
            >
              <input
                type="checkbox"
                checked={expandedSection === index}
                onChange={() => toggleSection(index)}
              />
              <div className="collapse-title text-xl font-medium">
                {section}
              </div>
              <div className="collapse-content">
                <ul className="space-y-2">
                  {topics.map((topic, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const renderBatchesTab = () => (
    <div>
      <h2 className="text-3xl font-bold mb-6">Upcoming Batches</h2>
      <div className="overflow-x-auto">
        {course.upcoming_batches && course.upcoming_batches.length > 0 ? (
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th className="bg-primary text-primary-content">
                  <Calendar size={16} className="inline mr-1" /> Date
                </th>
                <th className="bg-primary text-primary-content">
                  <Clock size={16} className="inline mr-1" /> Time
                </th>
                <th className="bg-primary text-primary-content">
                  <Monitor size={16} className="inline mr-1" /> Mode
                </th>
                <th className="bg-primary text-primary-content">
                  <Users size={16} className="inline mr-1" /> Type
                </th>
                <th className="bg-primary text-primary-content">Instructor</th>
                <th className="bg-primary text-primary-content text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {course.upcoming_batches.map((batch, index) => (
                <tr key={index} className="hover">
                  <td>{batch.date}</td>
                  <td>{batch.time}</td>
                  <td className="capitalize">{batch.mode_of_training}</td>
                  <td className="capitalize">{batch.batch_type}</td>
                  <td>{batch.instructor_name}</td>
                  <td className="text-right">
                    <button className="btn btn-primary btn-sm">
                      <Download size={16} className="mr-1" />
                      Enroll
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="alert alert-info">
            <span>
              No upcoming batches available at the moment. Please check back
              later or contact support.
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const renderReviewsTab = () => (
    <div>
      <h2 className="text-3xl font-bold mb-6">Reviews</h2>
      {course.reviews && course.reviews.length > 0 ? (
        <div className="space-y-4">
          {course.reviews.map((review, index) => (
            <div key={index} className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex justify-between">
                  <h3 className="font-bold">{review.name}</h3>
                </div>
                <p>{review.feedback}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert">No reviews yet</div>
      )}
    </div>
  );

  const renderFaqTab = () => (
    <div>
      <h2 className="text-3xl font-bold mb-6">FAQs</h2>
      <div className="space-y-4">
        {course.faqs?.map((faq, index) => (
          <div
            key={index}
            className="collapse collapse-arrow bg-base-100 shadow"
          >
            <input
              type="checkbox"
              checked={expandedFaq === index}
              onChange={() => toggleFaq(index)}
            />
            <div className="collapse-title text-lg font-medium">
              {faq.question}
            </div>
            <div className="collapse-content">
              <ul className="space-y-2 mt-2">
                {faq.answers.map((answer, ansIndex) => (
                  <li key={ansIndex} className="flex items-start gap-2">
                    <span className="text-secondary font-bold">•</span>
                    <span>{answer}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-base-200 min-h-screen">
      {/* Hero Section */}
      {/* https://res.cloudinary.com/ddvpkg9d4/ */}
      <div
        className="hero min-h-[50vh]"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://images.pexels.com/photos/633409/pexels-photo-633409.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-content text-neutral-content max-w-5xl mx-auto px-4">
          <div className="w-full">
            {course.university && (
              <div className="mb-2">
                <a href="#" className="link link-hover">
                  {course.university}
                </a>
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {course.title}
            </h1>

            <p className="text-lg mb-8 max-w-3xl">{course.overview}</p>

            <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100 text-base-content mb-6">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="stat-title">Duration</div>
                <div className="stat-value text-lg">{course.duration}</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-primary">
                  <Users className="w-6 h-6" />
                </div>
                <div className="stat-title">Level</div>
                <div className="stat-value text-lg">
                  {course.difficulty_level}
                </div>
              </div>

              <div className="stat">
                <div className="stat-figure text-primary">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="stat-title">Type</div>
                <div className="stat-value text-lg">{course.course_type}</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-primary">
                  <IndianRupee className="w-6 h-6" />
                </div>
                <div className="stat-title">Price</div>
                <div className="stat-value text-lg">₹{course.price}</div>
              </div>
            </div>

            <div className="flex flex-wrap justify-start gap-2">
              {course.category && (
                <div className="badge badge-primary p-3">{course.category}</div>
              )}
              {course.difficulty_level && (
                <div className="badge badge-secondary p-3">
                  {course.difficulty_level}
                </div>
              )}
              {course.course_type && (
                <div className="badge badge-accent p-3">
                  {course.course_type}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Tabs */}
            <div className="tabs tabs-boxed mb-6 overflow-x-auto">
              <button
                className={`tab ${activeTab === "about" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("about")}
              >
                About
              </button>
              <button
                className={`tab ${
                  activeTab === "curriculum" ? "tab-active" : ""
                }`}
                onClick={() => setActiveTab("curriculum")}
              >
                Curriculum
              </button>
              <button
                className={`tab ${activeTab === "batches" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("batches")}
              >
                Batches
              </button>
              <button
                className={`tab ${activeTab === "reviews" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews
              </button>
              <button
                className={`tab ${activeTab === "faq" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("faq")}
              >
                FAQs
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-base-100 rounded-lg shadow-lg p-6">
              {activeTab === "about" && renderAboutTab()}
              {activeTab === "curriculum" && renderCurriculumTab()}
              {activeTab === "batches" && renderBatchesTab()}
              {activeTab === "reviews" && renderReviewsTab()}
              {activeTab === "faq" && renderFaqTab()}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3  h-96">
            <div className="card bg-base-100 shadow-lg sticky top-8">
              <div className="relative mx-4 -mt-6 h-44 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-border text-white shadow-lg shadow-blue-500/40">
                {course.image ? (
                  <img
                    src={`https://res.cloudinary.com/ddvpkg9d4/${course.image}`}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span>{course.title}</span>
                  </div>
                )}
              </div>
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">Course Details</h2>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-primary"></div>
                    <span>{course.duration} course</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-primary"></div>
                    <span>{course.difficulty_level} level</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-primary"></div>
                    <span>Certificate of completion</span>
                  </li>
                  {course.support &&
                    course.support.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-primary"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                </ul>

                <div className="divider"></div>

                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="text-lg font-bold mr-2">Price:</span>
                    <span className="text-2xl font-bold">
                      ₹&nbsp;{course.price}
                    </span>
                  </div>
                  {course.discounts && course.discounts.length > 0 && (
                    <div className=" badge  badge-warning">
                      {course.discounts[0].value} Off
                    </div>
                  )}
                </div>

                <button className="btn btn-primary btn-block">
                  Enroll Now
                  <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
