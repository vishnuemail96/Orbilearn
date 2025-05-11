import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseDetailsById } from "../services/courseListApi";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("overview");

  useEffect(() => {
    setLoading(true);
    getCourseDetailsById(id)
      .then((response) => {
        console.log("Course Detail:", response.data);
        setCourse(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching course details:", error);
        setError("Failed to load course details");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center p-8">Loading course details...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!course) return <div className="text-center p-8">Course not found</div>;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "curriculum", label: "Curriculum" },
    { id: "batches", label: "Upcoming Batches" },
    { id: "faq", label: "FAQs" }
  ];

  const renderTabContent = () => {
    switch (selectedTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{course.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Objectives</h3>
              <ul className="list-disc pl-5 space-y-1">
                {course.objectives?.map((objective, index) => (
                  <li key={index} className="text-gray-700">{objective}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Prerequisites</h3>
              <ul className="list-disc pl-5 space-y-1">
                {course.prerequisites?.map((prerequisite, index) => (
                  <li key={index} className="text-gray-700">{prerequisite}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Skills Covered</h3>
              <div className="flex flex-wrap gap-2">
                {course.skills_covered?.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Tools Covered</h3>
              <div className="flex flex-wrap gap-2">
                {course.tools_covered?.map((tool, index) => (
                  <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {course.training_features?.map((feature, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-lg mb-2">{feature.title}</h4>
                  <ul className="space-y-1">
                    <li className="text-gray-700">• {feature.point1}</li>
                    <li className="text-gray-700">• {feature.point2}</li>
                    <li className="text-gray-700">• {feature.point3}</li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      
      case "curriculum":
        return (
          <div className="space-y-6">
            {Object.entries(course.curriculum || {}).map(([section, topics], index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-4 font-medium">{section}</div>
                <ul className="divide-y">
                  {topics.map((topic, topicIndex) => (
                    <li key={topicIndex} className="p-3 text-gray-700">
                      {topicIndex + 1}. {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      
      case "batches":
        return (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {course.upcoming_batches?.map((batch) => (
                    <tr key={batch.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{batch.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{batch.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{batch.mode_of_training}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{batch.batch_type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{batch.instructor_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                          Enroll Now
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      case "faq":
        return (
          <div className="space-y-4">
            {course.faqs?.map((faq, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-4 font-medium">{faq.question}</div>
                <div className="p-4">
                  <ul className="list-disc pl-5 space-y-1">
                    {faq.answers.map((answer, ansIndex) => (
                      <li key={ansIndex} className="text-gray-700">{answer}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        );
      
      default:
        return <div>Content not available</div>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="mb-8 bg-accent p-6 rounded-lg">
        <h1 className="text-3xl text-black font-bold mb-2">{course.title}</h1>
        <div className="flex flex-wrap gap-4 mb-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            Category: {course.category}
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            Duration: {course.duration}
          </span>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
            Level: {course.difficulty_level}
          </span>
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
            ₹{course.price}
          </span>
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
            Type: {course.course_type}
          </span>
        </div>
        
        <p className="text-gray-700 mb-6">{course.overview}</p>
        
        {/* Career and Package Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Left Column - Career Information */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">Career Opportunities</h3>
            <ul className="space-y-2">
              {course.designations?.map((designation, index) => (
                <li key={index} className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {designation}
                </li>
              ))}
            </ul>
            
            {course.target_audience && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Target Audience</h4>
                <div className="flex flex-wrap gap-2">
                  {course.target_audience.map((audience, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm">
                      {audience}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column - Package and Support */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-3">Salary Information</h3>
              {course.average_package && (
                <div className="space-y-2">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>{course.average_package.package}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                    <span>{course.average_package.salary_hike}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2">Support</h4>
              <ul className="space-y-1">
                {course.support?.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Assessment Methods</h4>
              <div className="flex flex-wrap gap-2">
                {course.assessment_methods?.map((method, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Discounts Badge */}
        {course.discounts && course.discounts.length > 0 && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 inline-block">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
              <div>
                <span className="font-medium text-green-800">
                  {course.discounts[0].type}: {course.discounts[0].value} Off
                </span>
                {course.discounts.length > 1 && (
                  <span className="text-xs text-green-700 ml-1">
                    + {course.discounts.length - 1} more
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="border-b">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`py-4 px-6 font-medium text-sm whitespace-nowrap ${
                  selectedTab === tab.id
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-6">
          {renderTabContent()}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium">
          Enroll Now
        </button>
      </div>
    </div>
  );
};

export default CourseDetail;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseDetailsById } from "../services/courseListApi";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("overview");

  useEffect(() => {
    setLoading(true);
    getCourseDetailsById(id)
      .then((response) => {
        console.log("Course Detail:", response.data);
        setCourse(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching course details:", error);
        setError("Failed to load course details");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  if (error) return <div className="alert alert-error text-center p-4">{error}</div>;
  if (!course) return <div className="alert alert-warning text-center p-4">Course not found</div>;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "curriculum", label: "Curriculum" },
    { id: "batches", label: "Upcoming Batches" },
    { id: "faq", label: "FAQs" }
  ];

  const renderTabContent = () => {
    switch (selectedTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Description Section */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-xl font-semibold">Description</h3>
                <p className="text-gray-700">{course.description}</p>
              </div>
            </div>

            {/* Objectives Section */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-xl font-semibold">Objectives</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {course.objectives?.map((objective, index) => (
                    <li key={index} className="text-gray-700">{objective}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Prerequisites Section */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-xl font-semibold">Prerequisites</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {course.prerequisites?.map((prerequisite, index) => (
                    <li key={index} className="text-gray-700">{prerequisite}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Skills and Tools Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-xl font-semibold">Skills Covered</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {course.skills_covered?.map((skill, index) => (
                      <span key={index} className="badge badge-primary badge-outline">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-xl font-semibold">Tools Covered</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {course.tools_covered?.map((tool, index) => (
                      <span key={index} className="badge badge-secondary badge-outline">{tool}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Career and Audience Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-lg font-semibold">Career Opportunities</h3>
                  <ul className="mt-2 space-y-2">
                    {course.designations?.map((designation, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-success mr-2">✓</span>
                        {designation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-lg font-semibold">Target Audience</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {course.target_audience?.map((audience, index) => (
                      <span key={index} className="badge badge-ghost">{audience}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Salary and Support Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-lg font-semibold">Salary Information</h3>
                  {course.average_package && (
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center">
                        <span className="text-info mr-2">₹</span>
                        <span>{course.average_package.package}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-success mr-2">↗</span>
                        <span>{course.average_package.salary_hike}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-lg font-semibold">Support & Assessment</h3>
                  <ul className="mt-2 space-y-1">
                    {course.support?.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-primary mr-2">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="divider divider-sm"></div>
                  <div className="flex flex-wrap gap-2">
                    {course.assessment_methods?.map((method, index) => (
                      <span key={index} className="badge badge-outline">{method}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Training Features Section */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-xl font-semibold">Training Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                  {course.training_features?.map((feature, index) => (
                    <div key={index} className="card bg-base-200 shadow-sm hover:shadow transition duration-300">
                      <div className="card-body p-4">
                        <h4 className="card-title text-lg text-primary">{feature.title}</h4>
                        <ul className="mt-2 space-y-1">
                          <li className="flex items-start">
                            <span className="text-success mr-2">✓</span>
                            <span>{feature.point1}</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-success mr-2">✓</span>
                            <span>{feature.point2}</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-success mr-2">✓</span>
                            <span>{feature.point3}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case "curriculum":
        return (
          <div className="space-y-4">
            {Object.entries(course.curriculum || {}).map(([section, topics], index) => (
              <div key={index} className="collapse collapse-arrow bg-base-100 shadow-sm">
                <input type="checkbox" />
                <div className="collapse-title text-lg font-medium">
                  {section}
                </div>
                <div className="collapse-content">
                  <ul className="space-y-2">
                    {topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="flex">
                        <span className="text-primary font-medium mr-2">{topicIndex + 1}.</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        );
      
      case "batches":
        return (
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body p-0">
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Mode</th>
                      <th>Type</th>
                      <th>Instructor</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.upcoming_batches?.map((batch) => (
                      <tr key={batch.id} className="hover">
                        <td>{batch.date}</td>
                        <td>{batch.time}</td>
                        <td className="capitalize">{batch.mode_of_training}</td>
                        <td className="capitalize">{batch.batch_type}</td>
                        <td>{batch.instructor_name}</td>
                        <td>
                          <button className="btn btn-primary btn-sm">Enroll</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      
      case "faq":
        return (
          <div className="space-y-4">
            {course.faqs?.map((faq, index) => (
              <div key={index} className="collapse collapse-plus bg-base-100 shadow-sm">
                <input type="checkbox" />
                <div className="collapse-title text-lg font-medium">
                  {faq.question}
                </div>
                <div className="collapse-content">
                  <ul className="list-disc pl-5 space-y-2">
                    {faq.answers.map((answer, ansIndex) => (
                      <li key={ansIndex}>{answer}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        );
      
      default:
        return <div className="alert alert-info">Content not available</div>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Course Header */}
      <div className="card bg-primary text-primary-content mb-8">
        <div className="card-body">
          <h1 className="card-title text-3xl font-bold">{course.title}</h1>
          
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="badge badge-outline">{course.category}</span>
            <span className="badge badge-outline">{course.duration}</span>
            <span className="badge badge-outline">{course.difficulty_level}</span>
            <span className="badge badge-outline">₹{course.price}</span>
            <span className="badge badge-outline">{course.course_type}</span>
          </div>
          
          <p className="mt-4">{course.overview}</p>
          
          {/* Discount Badge */}
          {course.discounts && course.discounts.length > 0 && (
            <div className="badge badge-success gap-2 mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              {course.discounts[0].type}: {course.discounts[0].value} Off
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs tabs-boxed mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`tab ${selectedTab === tab.id ? 'tab-active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mb-8">
        {renderTabContent()}
      </div>

      {/* Enrollment Action */}
      <div className="flex justify-center mt-8">
        <button className="btn btn-primary btn-lg">Enroll Now</button>
      </div>
    </div>
  );
};

export default CourseDetail;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseDetailsById } from "../services/courseListApi";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("overview");

  useEffect(() => {
    setLoading(true);
    getCourseDetailsById(id)
      .then((response) => {
        console.log("Course Detail:", response.data);
        setCourse(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching course details:", error);
        setError("Failed to load course details");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  if (error) return <div className="alert alert-error text-center p-4">{error}</div>;
  if (!course) return <div className="alert alert-warning text-center p-4">Course not found</div>;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "curriculum", label: "Curriculum" },
    { id: "batches", label: "Upcoming Batches" },
    { id: "faq", label: "FAQs" }
  ];

  const renderTabContent = () => {
    switch (selectedTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Description Section */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-xl font-semibold">Description</h3>
                <p className="text-gray-700">{course.description}</p>
              </div>
            </div>

            {/* Objectives Section */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-xl font-semibold">Objectives</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {course.objectives?.map((objective, index) => (
                    <li key={index} className="text-gray-700">{objective}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Prerequisites Section */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-xl font-semibold">Prerequisites</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {course.prerequisites?.map((prerequisite, index) => (
                    <li key={index} className="text-gray-700">{prerequisite}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Skills and Tools Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-xl font-semibold">Skills Covered</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {course.skills_covered?.map((skill, index) => (
                      <span key={index} className="badge badge-primary badge-outline">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-xl font-semibold">Tools Covered</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {course.tools_covered?.map((tool, index) => (
                      <span key={index} className="badge badge-secondary badge-outline">{tool}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Career and Audience Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-lg font-semibold">Career Opportunities</h3>
                  <ul className="mt-2 space-y-2">
                    {course.designations?.map((designation, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-success mr-2">✓</span>
                        {designation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-lg font-semibold">Target Audience</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {course.target_audience?.map((audience, index) => (
                      <span key={index} className="badge badge-ghost">{audience}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Salary and Support Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-lg font-semibold">Salary Information</h3>
                  {course.average_package && (
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center">
                        <span className="text-info mr-2">₹</span>
                        <span>{course.average_package.package}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-success mr-2">↗</span>
                        <span>{course.average_package.salary_hike}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-lg font-semibold">Support & Assessment</h3>
                  <ul className="mt-2 space-y-1">
                    {course.support?.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-primary mr-2">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="divider divider-sm"></div>
                  <div className="flex flex-wrap gap-2">
                    {course.assessment_methods?.map((method, index) => (
                      <span key={index} className="badge badge-outline">{method}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Training Features Section */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-xl font-semibold">Training Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                  {course.training_features?.map((feature, index) => (
                    <div key={index} className="card bg-base-200 shadow-sm hover:shadow transition duration-300">
                      <div className="card-body p-4">
                        <h4 className="card-title text-lg text-primary">{feature.title}</h4>
                        <ul className="mt-2 space-y-1">
                          <li className="flex items-start">
                            <span className="text-success mr-2">✓</span>
                            <span>{feature.point1}</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-success mr-2">✓</span>
                            <span>{feature.point2}</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-success mr-2">✓</span>
                            <span>{feature.point3}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case "curriculum":
        return (
          <div className="space-y-4">
            {Object.entries(course.curriculum || {}).map(([section, topics], index) => (
              <div key={index} className="collapse collapse-arrow bg-base-100 shadow-sm">
                <input type="checkbox" />
                <div className="collapse-title text-lg font-medium">
                  {section}
                </div>
                <div className="collapse-content">
                  <ul className="space-y-2">
                    {topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="flex">
                        <span className="text-primary font-medium mr-2">{topicIndex + 1}.</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        );
      
      case "batches":
        return (
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body p-0">
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Mode</th>
                      <th>Type</th>
                      <th>Instructor</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.upcoming_batches?.map((batch) => (
                      <tr key={batch.id} className="hover">
                        <td>{batch.date}</td>
                        <td>{batch.time}</td>
                        <td className="capitalize">{batch.mode_of_training}</td>
                        <td className="capitalize">{batch.batch_type}</td>
                        <td>{batch.instructor_name}</td>
                        <td>
                          <button className="btn btn-primary btn-sm">Enroll</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      
      case "faq":
        return (
          <div className="space-y-4">
            {course.faqs?.map((faq, index) => (
              <div key={index} className="collapse collapse-plus bg-base-100 shadow-sm">
                <input type="checkbox" />
                <div className="collapse-title text-lg font-medium">
                  {faq.question}
                </div>
                <div className="collapse-content">
                  <ul className="list-disc pl-5 space-y-2">
                    {faq.answers.map((answer, ansIndex) => (
                      <li key={ansIndex}>{answer}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        );
      
      default:
        return <div className="alert alert-info">Content not available</div>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-black">
      {/* Course Header */}
      <div className="card bg-primary text-primary-content mb-8">
        <div className="card-body">
          <h1 className="card-title text-3xl font-bold">{course.title}</h1>
          
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="badge badge-outline">{course.category}</span>
            <span className="badge badge-outline">{course.duration}</span>
            <span className="badge badge-outline">{course.difficulty_level}</span>
            <span className="badge badge-outline">₹{course.price}</span>
            <span className="badge badge-outline">{course.course_type}</span>
          </div>
          
          <p className="mt-4">{course.overview}</p>
          
          {/* Discount Badge */}
          {course.discounts && course.discounts.length > 0 && (
            <div className="badge badge-success gap-2 mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              {course.discounts[0].type}: {course.discounts[0].value} Off
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs tabs-boxed mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`tab ${selectedTab === tab.id ? 'tab-active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mb-8">
        {renderTabContent()}
      </div>

      {/* Enrollment Action */}
      <div className="flex justify-center mt-8">
        <button className="btn btn-primary btn-lg">Enroll Now</button>
      </div>
    </div>
  );
};

export default CourseDetail;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseDetailsById } from "../services/courseListApi";
import {
  ChevronDown,
  CheckCircle,
  BookOpen,
  Calendar,
  Users,
  HelpCircle,
  Award,
  Star,
  DollarSign,
  Clock,
  Wrench,
  BookmarkCheck,
  Code,
  Monitor,
  CreditCard,
  ArrowRight,
  BarChart2,
  PlusCircle,
  Download,
  Coffee,
} from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    setLoading(true);
    getCourseDetailsById(id)
      .then((response) => {
        console.log("Course Detail:", response.data);
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
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const toggleFaq = (index) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-[#F7F1F1]">
        <div className="w-16 h-16 rounded-full border-4 border-[#19A7CD] border-t-[#F7F1F1] animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-[#F7F1F1] p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-md">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-[#19A7CD] text-white rounded hover:bg-[#146C94] transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  if (!course)
    return (
      <div className="flex justify-center items-center h-screen bg-[#F7F1F1] p-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded shadow-md">
          <p className="text-yellow-700">Course not found</p>
          <button
            onClick={() => window.history.back()}
            className="mt-2 px-4 py-2 bg-[#19A7CD] text-white rounded hover:bg-[#146C94] transition-colors duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  const tabs = [
    { id: "overview", label: "Overview", icon: <BookOpen size={18} /> },
    {
      id: "curriculum",
      label: "Curriculum",
      icon: <BookmarkCheck size={18} />,
    },
    { id: "batches", label: "Upcoming Batches", icon: <Calendar size={18} /> },
    { id: "faq", label: "FAQs", icon: <HelpCircle size={18} /> },
  ];

  const renderTabContent = () => {
    switch (selectedTab) {
      case "overview":
        return (
          <div className="space-y-8 animate-fadeIn">
            {/* Description Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-[#146C94] mb-3 flex items-center">
                <BookOpen className="mr-2 text-[#19A7CD]" size={20} />
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Objectives Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-[#146C94] mb-3 flex items-center">
                <Award className="mr-2 text-[#19A7CD]" size={20} />
                Objectives
              </h3>
              <ul className="space-y-2">
                {course.objectives?.map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="text-[#19A7CD] mr-2 mt-1 h-5 w-5" />
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills and Tools Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-[#146C94] mb-3 flex items-center">
                  <Code className="mr-2 text-[#19A7CD]" size={20} />
                  Skills Covered
                </h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  {course.skills_covered?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#F7F1F1] text-[#146C94] rounded-full text-sm transform hover:scale-105 transition-transform duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-[#146C94] mb-3 flex items-center">
                  <Wrench className="mr-2 text-[#19A7CD]" size={20} />
                  Tools Covered
                </h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  {course.tools_covered?.map((tool, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#F7F1F1] text-[#19A7CD] rounded-full text-sm transform hover:scale-105 transition-transform duration-200"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Prerequisites Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-[#146C94] mb-3 flex items-center">
                <CheckCircle className="mr-2 text-[#19A7CD]" size={20} />
                Prerequisites
              </h3>
              <ul className="space-y-2">
                {course.prerequisites?.map((prerequisite, index) => (
                  <li key={index} className="flex items-start">
                    <ArrowRight className="text-[#19A7CD] mr-2 h-5 w-5 mt-1" />
                    <span className="text-gray-700">{prerequisite}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Career and Audience Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-[#146C94] mb-3 flex items-center">
                  <BarChart2 className="mr-2 text-[#19A7CD]" size={20} />
                  Career Opportunities
                </h3>
                <ul className="space-y-2">
                  {course.designations?.map((designation, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-gray-700">{designation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-[#146C94] mb-3 flex items-center">
                  <Users className="mr-2 text-[#19A7CD]" size={20} />
                  Target Audience
                </h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  {course.target_audience?.map((audience, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#F7F1F1] text-gray-700 rounded-full text-sm transform hover:scale-105 transition-transform duration-200"
                    >
                      {audience}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Salary and Support Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-[#146C94] mb-3 flex items-center">
                  <DollarSign className="mr-2 text-[#19A7CD]" size={20} />
                  Salary Information
                </h3>
                {course.average_package && (
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center">
                      <div className="bg-[#19A7CD] text-white p-2 rounded-full mr-3 flex items-center justify-center">
                        <DollarSign className="h-5 w-5" />
                      </div>
                      <span className="text-lg font-medium text-[#000000]">
                        {course.average_package.package}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-green-500 text-white p-2 rounded-full mr-3 flex items-center justify-center">
                        <BarChart2 className="h-5 w-5" />
                      </div>
                      <span className="text-lg font-medium text-[#000000]">
                        {course.average_package.salary_hike}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-[#146C94] mb-3 flex items-center">
                  <Star className="mr-2 text-[#19A7CD]" size={20} />
                  Support & Assessment
                </h3>
                <ul className="space-y-2">
                  {course.support?.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-[#19A7CD] mr-2" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-200 my-4"></div>
                <div className="flex flex-wrap gap-2">
                  {course.assessment_methods?.map((method, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#F7F1F1] text-gray-700 rounded-full text-sm transform hover:scale-105 transition-transform duration-200"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Training Features Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-[#146C94] mb-6 flex items-center">
                <Award className="mr-2 text-[#19A7CD]" size={20} />
                Training Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {course.training_features?.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-[#F7F1F1] rounded-lg p-5 transition-all duration-300 hover:shadow-md transform hover:scale-105"
                  >
                    <h4 className="text-lg font-medium text-[#19A7CD] mb-3">
                      {feature.title}
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-700 text-sm">
                          {feature.point1}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-700 text-sm">
                          {feature.point2}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-700 text-sm">
                          {feature.point3}
                        </span>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "curriculum":
        return (
          <div className="space-y-4 animate-fadeIn">
            {Object.entries(course.curriculum || {}).map(
              ([section, topics], index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <div
                    className="p-4 bg-[#F7F1F1] cursor-pointer flex justify-between items-center"
                    onClick={() => toggleSection(index)}
                  >
                    <h3 className="text-lg font-medium text-[#146C94] flex items-center">
                      <BookOpen className="mr-2 text-[#19A7CD]" size={18} />
                      {section}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-[#146C94] transform transition-transform duration-300 ${
                        expandedSection === index ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      expandedSection === index ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="p-4">
                      <ul className="space-y-3">
                        {topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="flex">
                            <span className="text-[#19A7CD] font-medium mr-2">
                              {topicIndex + 1}.
                            </span>
                            <span className="text-gray-700">{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        );

      case "batches":
        return (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#F7F1F1]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#146C94] uppercase tracking-wider">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        Date
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#146C94] uppercase tracking-wider">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        Time
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#146C94] uppercase tracking-wider">
                      <div className="flex items-center">
                        <Monitor className="mr-2 h-4 w-4" />
                        Mode
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#146C94] uppercase tracking-wider">
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        Type
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#146C94] uppercase tracking-wider">
                      <div className="flex items-center">
                        <Coffee className="mr-2 h-4 w-4" />
                        Instructor
                      </div>
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-[#146C94] uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {course.upcoming_batches?.map((batch, index) => (
                    <tr
                      key={batch.id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-[#F7F1F1]"
                      } hover:bg-gray-50 transition-colors duration-200`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {batch.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {batch.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                        {batch.mode_of_training}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                        {batch.batch_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {batch.instructor_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="px-4 py-2 bg-[#19A7CD] hover:bg-[#146C94] text-white rounded-md transition-all duration-300 text-sm font-medium transform hover:scale-105 flex items-center justify-center">
                          <Download className="h-4 w-4 mr-1" />
                          Enroll
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "faq":
        return (
          <div className="space-y-4 animate-fadeIn">
            {course.faqs?.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="text-lg font-medium text-[#146C94] flex items-center">
                    <HelpCircle className="mr-2 text-[#19A7CD]" size={18} />
                    {faq.question}
                  </h3>
                  {expandedFaq === index ? (
                    <ChevronDown className="w-5 h-5 text-[#146C94] transform rotate-180 transition-transform duration-300" />
                  ) : (
                    <PlusCircle className="w-5 h-5 text-[#146C94] transition-transform duration-300" />
                  )}
                </div>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    expandedFaq === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="p-4 bg-[#F7F1F1]">
                    <ul className="space-y-2">
                      {faq.answers.map((answer, ansIndex) => (
                        <li key={ansIndex} className="flex items-start">
                          <span className="text-[#19A7CD] mr-2">•</span>
                          <span className="text-gray-700">{answer}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="bg-blue-50 border-l-4 border-[#19A7CD] p-4 rounded">
            <p className="text-[#146C94]">Content not available</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F1F1]">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-[#146C94] to-[#19A7CD] text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              {" "}
              <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-fadeIn">
                {course.title}
              </h1>
              <button className="px-6 py-3 bg-[white] hover:bg-black text-[#146C94] rounded-lg shadow-lg transition-all duration-300 font-medium text-lg flex items-center transform hover:scale-105">
                <Download className="mr-2" />
                Enroll Now
              </button>
            </div>
            <div className="flex flex-wrap items-center mb-4">
              <span className="px-3 py-1 bg-white text-[#146C94] rounded-full text-sm font-medium mr-2 mb-2 flex items-center">
                <BookmarkCheck className="h-4 w-4 mr-1" />
                {course.category}
              </span>
              <span className="px-3 py-1 bg-white text-[#146C94] rounded-full text-sm font-medium mr-2 mb-2 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {course.duration}
              </span>
              <span className="px-3 py-1 bg-white text-[#146C94] rounded-full text-sm font-medium mr-2 mb-2 flex items-center">
                <Star className="h-4 w-4 mr-1" />
                {course.difficulty_level}
              </span>
              <span className="px-3 py-1 bg-white text-[#146C94] rounded-full text-sm font-medium mr-2 mb-2 flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                {course.price}
              </span>
              <span className="px-3 py-1 bg-white text-[#146C94] rounded-full text-sm font-medium mb-2 flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                {course.course_type}
              </span>
            </div>
            <p className="text-lg opacity-90 mb-6 animate-fadeIn">
              {course.overview}
            </p>

            {/* Discount Badge */}
            {course.discounts && course.discounts.length > 0 && (
              <div className="inline-block bg-white text-[#146C94] px-4 py-2 rounded-lg font-medium transform hover:scale-105 transition-transform duration-300 animate-pulse">
                <span className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  {course.discounts[0].type}: {course.discounts[0].value} Off
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Tabs Navigation */}
          <div className="flex overflow-x-auto mb-8 bg-white rounded-lg shadow-sm p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex-1 min-w-fit px-4 py-3 text-center font-medium transition-all duration-300 flex items-center justify-center ${
                  selectedTab === tab.id
                    ? "bg-[#19A7CD] text-white rounded-md transform scale-105"
                    : "text-gray-600 hover:text-[#146C94]"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mb-8">{renderTabContent()}</div>

          {/* Enrollment Action */}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default CourseDetail;
