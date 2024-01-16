import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {updateUserStart, updateUserSuccess, updateUserfailure} from '../redux/user/userSlice'

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, SetUpdateSuccess]= useState(false);
const dispatch = useDispatch();
  // Firebase Storage
  // allow read;
  // allow write : if
  // request.resource.size <2 * 1024 * 1024 &&
  // request.resource.contentType.matches ('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e)=>{
setFormData ({...formData, [e.target.id] : e.target.value});
  }
const handleSubmit = async (e) =>{
  e.preventDefault();
  try {
    dispatch (updateUserStart());
    const res = await fetch(`/BackendEstate/user/update/${currentUser._id}`,{
      method:"POST" ,
      headers:{
        'Content-Type':'application/json'
        },
        body:JSON.stringify(formData)
        });
        const data = await res.json();
        if (data.success === false){
          dispatch(updateUserfailure(data.message))
          return;
        }

        dispatch(updateUserSuccess(data))
        SetUpdateSuccess(true)
  } catch (error) {
    dispatch(updateUserfailure(error.message))  }

}


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semi-bold text-center">Profile</h1>
      <form onSubmit = {handleSubmit} className="flex flex-col gap-4">
        <input ref={fileRef}
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-4"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-600">
              error image upload (Image must be less than 2mb){" "}
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-600">Image successfully uploaded </span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}

        />
        <button disabled ={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? 'loading...' : 'Update'}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign-up</span>
        
        
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""} </p>
<p className="text-green-700 mt-5"> {updateSuccess ? "User is updated successfully" : ""}</p>
    </div>
  );
}
