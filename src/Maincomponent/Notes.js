import React, { useState, useEffect } from "react";

const Notes = () => {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNotes, setFilteredNotes] = useState(notes);
  const [selectedTag, setSelectedTag] = useState("");
  const [currentNote, setCurrentNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});
  const [isModaladdOpen, setIsModaladdOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    content: "",
    title: "",
    tags: "",
    tagsother: "",
  });
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevFormData) => {
        const currentData = prevFormData[name];
        const currentArray = Array.isArray(currentData)
          ? currentData
          : currentData
          ? [currentData]
          : [];
        const newValues = checked
          ? [...currentArray, value]
          : currentArray.filter((v) => v !== value);

        return {
          ...prevFormData,
          [name]: newValues,
        };
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    setErrors({
      ...errors,
      [name]: "",
    });
  };
  const handleAdd = () => {
    console.log("clicked");
    setIsModaladdOpen(true);
  };
  const handleSave = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.title) {
      newErrors.title = "Please add title";
    }
    if (!formData.content) {
      newErrors.content = "Please add Content";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const timestamp = new Date().toLocaleString();
      const tags = { ...formData.tags };

      if (tags.other && formData.tagsother) {
        tags.other = formData.tagsother;
      } else if (!tags.other) {
        delete tags.other;
      }
      if (currentNote) {
        setNotes((prev) =>
          prev.map((note) =>
            note.id === currentNote.id
              ? { ...note, ...formData, timestamp }
              : note
          )
        );
      } else {
        setNotes((prev) => [
          ...prev,
          { id: Date.now(), ...formData, timestamp },
        ]);
      }

      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      tags: {
        learning: "",
        personalSpace: "",
        idea: "",
        other: "",
      },
      tagsOther: "",
    });
    setCurrentNote(null);
    setIsModaladdOpen(false);
  };

  const handleDelete = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    setCurrentNote(null);
  };

  const handleView = (note) => {
    setCurrentNote(note);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentNote(null);
  };
  const handleEdit = (note) => {
    setCurrentNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      tags: {
        learning: note.tags.learning || false,
        personalSpace: note.tags.personalSpace || false,
        idea: note.tags.idea || false,
        other: note.tags.other || false,
      },
      tagsOther: note.tagsOther || "",
    });
    setIsModaladdOpen(true); // Open the modal for editing
  };

  // learning
  const handleTagChange = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: {
        ...prev.tags,
        [tag]: !prev.tags[tag],
      },
    }));

    setErrors((prev) => ({
      ...prev,
      tags: "",
    }));
  };

  const handleTagFilter = (tag) => {
    setSelectedTag(tag);
    if (tag) {
      const filteredByTag = notes.filter((note) => note.tags[tag]);
      setFilteredNotes(filteredByTag);
    } else {
      setFilteredNotes(notes);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const results = notes.filter((note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNotes(results);
    } else {
      setFilteredNotes(notes);
    }
  }, [searchTerm, notes]);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
    setFilteredNotes(notes);
  }, [notes]);

  const truncateDescription = (description, length) => {
    if (!description) {
      return "";
    }
    if (description.length > length) {
      return description.substring(0, length) + "...";
    }
    return description;
  };
  return (
    <div className="Appnotes">
      <h1 className="app-heading">Notes App</h1>
      {notes.length == 0 && (
        <div className="add-notes-box">
          <h1>Please add Notes</h1>
          <button onClick={() => handleAdd()}>+ Add Notes</button>
        </div>
      )}

      {isModaladdOpen && (
        <div className="popup-container-custom">
          <div className="popup-wrapper pop-open custom-popup-width">
            <div className="top-head-box flex space-between align-center">
              <h5>{currentNote ? "Edit Note" : "Add Notes"}</h5>
              <div
                className="pop-cross-btn"
                onClick={() => {
                  setIsModaladdOpen(false);
                  setCurrentNote(null);
                }}
              >
                <img src="/img/cross-icon.svg" alt="" />
              </div>
            </div>
            <div className="inner-poupup">
              <form onSubmit={handleSave}>
                <div className="form-wrapper-box flex space-between">
                  <div className="form-group bordertop">
                    {/* <h5 className="mb-12">Title</h5> */}
                    <label htmlFor="">
                      <b>Title</b>
                    </label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Please specify Title"
                      className="form-control"
                      value={formData.title}
                      onChange={handleChange}
                    />
                    {errors.title && (
                      <p className="error-msg">{errors.title}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <h5>Tags</h5>
                    <label htmlFor="">
                      Add Tags
                      <span className="required-sign">*</span>
                    </label>
                    <div className="custom-check-box">
                      <ul>
                        <li>
                          <div className="checkbox">
                            <label className="flex">
                              <input
                                type="checkbox"
                                name="tags"
                                value="Learning"
                                checked={formData.tags.learning}
                                onChange={() => handleTagChange("learning")}
                              />
                              <img src="/img/learning.jfif" alt="img" />
                              Learning
                              <span className="checkmark"></span>
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="checkbox">
                            <label className="flex">
                              <input
                                type="checkbox"
                                name="tags"
                                value="Personalspace"
                                checked={formData.tags.personalSpace}
                                onChange={() =>
                                  handleTagChange("personalSpace")
                                }
                              />
                              <img src="/img/personalspace.png" alt="img" />
                              Personal Space
                              <span className="checkmark"></span>
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="checkbox">
                            <label className="flex">
                              <input
                                type="checkbox"
                                name="tags"
                                value="Ideas"
                                checked={formData.tags.idea}
                                onChange={() => handleTagChange("idea")}
                              />
                              <img src="/img/idea.png" alt="img" />
                              Ideas
                              <span className="checkmark"></span>
                            </label>
                          </div>
                        </li>
                      </ul>

                      {errors.tags && (
                        <p className="error-msg">{errors.tags}</p>
                      )}
                    </div>
                  </div>

                  <div className="form-group bordertop">
                  
                    <label htmlFor="">
                      <b>Content</b>
                    </label>
                    <textarea
                      name="content"
                      placeholder="Please add content"
                      className="form-control"
                      value={formData.content}
                      onChange={handleChange}
                    ></textarea>
                    {errors.content && (
                      <p className="error-msg">{errors.content}</p>
                    )}
                  </div>
                  <div className="btn-box flex space-between custom-flex">
                    <a onClick={handleSave} className="cta-btn upate-btn">
                      Save
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {notes.length > 0 ? (
        <>
          <div className="notes-box-top">
            <h2>Saved Notes</h2>
          

            <input
              type="text"
              placeholder="Search by title..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
              <button onClick={handleAdd}>+Add more Notes</button>
          </div>

          <div className="tags-filter">
            <h3>Filter by Tags:</h3>
            <button
              className={selectedTag === "" ? "active" : ""}
              onClick={() => handleTagFilter("")}
            >
              All
            </button>
            <button
              className={selectedTag === "learning" ? "active" : ""}
              onClick={() => handleTagFilter("learning")}
            >
              Learning
            </button>
            <button
              className={selectedTag === "personalSpace" ? "active" : ""}
              onClick={() => handleTagFilter("personalSpace")}
            >
              Personal Space
            </button>
            <button
              className={selectedTag === "idea" ? "active" : ""}
              onClick={() => handleTagFilter("idea")}
            >
              Ideas
            </button>
          </div>

          <div className="note-list">
            {filteredNotes
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((note) => (
                <div key={note.id} className="note-item">
                  <div className="button-container">
                    <button
                      onClick={() => handleView(note)}
                      className="note-button"
                    >
                      <img src="/img/view-icon.png" alt="View" /> View
                    </button>
                    <button
                      onClick={() => handleEdit(note)}
                      className="note-button"
                    >
                      <img src="/img/edit-icon.png" alt="Edit" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="note-button"
                    >
                      <img src="/img/delete-icon.png" alt="Delete" /> Delete
                    </button>
                  </div>
                  <h3 className="notes-content">{note.title}</h3>
                  <p className="notes-content">
                    {" "}
                    {truncateDescription(note.content, 250)}
                  </p>

                  <div className="tag-container">
                    <h2 className="tag-heading">Tags</h2>
                    <div className="tags-list">
                      {Object.entries(note.tags).map(([key, value]) =>
                        value ? (
                          <span key={key} className="tag">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </span>
                        ) : null
                      )}
                    </div>
                  </div>
                  <p className="timestamp">{note.timestamp}</p>
                </div>
              ))}
          </div>
        </>
      ) : (
        ""
      )}

      {isModalOpen && currentNote && (
     <div className="modal">
     <div className="modal-content">
       <div className="modal-header">
         <h2>{currentNote.title}</h2>
         <button className="close-button" onClick={closeModal}> <img src="/img/cross-icon.svg" alt="" /></button>
       </div>
       <div className="modal-body">
         <p>{currentNote.content}</p>
         <div className="tags-container">
           {Object.entries(currentNote.tags).map(([key, value]) =>
             value ? (
               <span key={key} className="tag">
                 {key.charAt(0).toUpperCase() + key.slice(1)}
               </span>
             ) : null
           )}
         </div>
       </div>
       <div className="modal-footer">
         <button className="close-button" onClick={closeModal}>Close</button>
       </div>
     </div>
   </div>
   
      )}
    </div>
  );
};

export default Notes;
