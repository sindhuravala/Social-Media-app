import React, { useState, useEffect } from 'react';
import Navbar from "./Nav";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {Modal, Form, Button} from 'react-bootstrap'


//import "../App.css"
const Profile = () => {
    const [name, setName] = useState('');
    const [adminId, setAdminId] = useState('');
    const [isLoaded, setIsLoaded] = useState(false); //set true if tocken is valid
    const [token, setToken] = useState('');
    const [show, setShow] = useState(false); //new post modal
    const [editPostModal, setEditPostModal] = useState(false);
    //posts
    const [post, setPost] = useState('');
    const [posts, setPosts] = useState([]);
    const [editpost, setEditPost] = useState('');
    const [postid, setPostId] = useState('');
    //alerts
    const [errorAlert, setErrorAlert] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
    }, []);

    const refreshToken = async () => {
        await axios.get('http://localhost:3001/user/token').
            then(function (response) {
                // handle success
                const decoded = jwt_decode(response.data.accessToken);
                setToken(response.data.accessToken);
                setIsLoaded(true);
                setAdminId(decoded.admin_id);
                setName(decoded.username);
              })
              .catch(function (error) {
                // handle error
                console.log(error);
                if (error.response) {
                    navigate("/");
                }
             })
    }
    //show or hide modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    //show edit post modal
    const handleCloseEditModal = () => setEditPostModal(false);
    const deletePost = async (post) => {
        //alert('Delete post:'+ post.post_content);
        const requestOptions = {
            method: 'DELETE',
            credentials: "include",
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ postid: post._id })
        };
        fetch('http://localhost:3001/post/DeletePost', requestOptions)
            .then(response =>response.json())
            .then(data => {
                //console.log('Success:', data);
                getUserPosts();
                alert(data.success)
                
              })
            .catch(error => {
                if (error.response) {
                    alert('Error post not deleted');
                }
            });;
    }

    const request = async (reqMethod, url, data) => {
        
        const requestOptions = {
            method: reqMethod,
            credentials: "include",
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        };

        let response = await fetch(url, requestOptions);
        let resp = await response.json;
        return resp;

    }

    const editPostForm = async (post) => {
        setEditPost(post.post_content);
        setPostId(post.post_id)
        setEditPostModal(true);
    }

    const saveNewPost = async (e) => {
        e.preventDefault();
        setErrorAlert(false);
        setSuccessAlert(false);
        let validPost = true;
        if(post == ""){
            validPost = false;
            setErrorAlert("Post can not be empty");
        }

        if(validPost){
            await axios.post('http://localhost:3001/post/CreatePost', {
                postcontent: post,
                admin_id: adminId
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(function (response) {
                // handle success
                console.log(response);
                setPost('');
                setSuccessAlert(response.data.message);
                getUserPosts();
                setTimeout(()=>{
                    setSuccessAlert(false);
                    setErrorAlert(false);
                    handleClose();
                }, 4000);
              })
              .catch(function (error) {
                // handle error
                console.log(error);
                if (error.response) {
                    setErrorAlert(error.response.data.message);
                }
              })
        }
    }

    const getUserPosts = async () =>{
        await axios.post('http://localhost:3001/post/userposts', {
            admin_id: adminId
        },{
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(function (response) {
            // handle success
            console.log(response.data);
            setPosts(response.data);
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })
    }

    if(isLoaded){
        getUserPosts();
        setIsLoaded(false);
    }
    return (
        <>
            <Navbar/>
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-md-8 col-sm-12 col-xl-6">
                     <div className="card mt-5">
                        <h2 className="card-title text-center">{name} </h2>
                        <div className="card-body">
                            <div className="row justify-content-center">
                                <button onClick={handleShow} style={{width:"auto"}} className="btn btn-primary btn-sm">New post</button>
                            </div>
                        </div>
                     </div>
                  </div>
               </div>
               {posts.map((post,) => (
                    <div key={post.post_id} className="row justify-content-center">
                        <div className="col-md-8 col-sm-12 col-xl-6">
                            <div className="card mt-2">
                                <div className="card-body">
                                    <p className="text-center">{post.post_content}</p>
                                    <div className="d-grid gap-2 d-md-flex justify-content-between">
                                        <div className="float-left"><button onClick={e=> editPostForm(post) } className="btn btn-sm btn-primary">Edit</button></div>
                                        <div className="float-right"><button onClick={e=> deletePost(post)} className="btn btn-sm btn-danger me-md-2">Delete</button></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
               ))}
               <div className="row">
               <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>New post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {successAlert && 
                            <div className="alert alert-success" role="alert">
                                {successAlert}
                            </div>
                        }

                        {errorAlert && 
                            <div className="alert alert-danger" role="alert">
                                {errorAlert}
                            </div>
                        }
                        <Form>
                            <Form.Group
                                className="mb-3"
                                controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Post content</Form.Label>
                                <Form.Control
                                    as="textarea" 
                                    rows={3}
                                    value={post} 
                                    onChange={(e) => setPost(e.target.value)} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" className="btn-sm" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" className="btn-sm" onClick={saveNewPost}>
                        Save
                    </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={editPostModal} onHide={handleCloseEditModal}>
                    <Modal.Header closeButton>
                    <Modal.Title>Edit post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {successAlert && 
                            <div className="alert alert-success" role="alert">
                                {successAlert}
                            </div>
                        }

                        {errorAlert && 
                            <div className="alert alert-danger" role="alert">
                                {errorAlert}
                            </div>
                        }
                        <Form>
                            <Form.Group
                                className="mb-3"
                                controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Post content</Form.Label>
                                <Form.Control
                                    as="textarea" 
                                    rows={3}
                                    value={editpost} 
                                    onChange={(e) => setEditPost(e.target.value)} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" className="btn-sm" onClick={handleCloseEditModal}>
                        Close
                    </Button>
                    <Button variant="primary" className="btn-sm" onClick={saveNewPost}>
                        Save
                    </Button>
                    </Modal.Footer>
                </Modal>
               </div>
            </div>
        </>
    );
}
export default Profile;