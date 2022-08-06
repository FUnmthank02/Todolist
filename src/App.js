import { useEffect, useState } from "react"
import axios from 'axios'
import './App.css';
import './Component/RespApp.css';
import Notify from "./Component/Notify";
import { Grid } from "@mui/material";
import { Button } from '@mui/material';
import { Dialog } from '@mui/material';
import { DialogActions } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogContentText } from '@mui/material';
import { DialogTitle } from '@mui/material';
import NightlightIcon from '@mui/icons-material/Nightlight';
import LightModeIcon from '@mui/icons-material/LightMode';

function App() {
  const [job, setJob] = useState('')
  const [APIData, setAPIData] = useState([])
  const [id, setID] = useState(null)
  const [noti, setNoti] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [appearUpdate, setAppearUpdate] = useState(false)
  const [alertDialog, setAlertDialog] = useState(false)
  const [removeId, setRemoveId] = useState('')
  const [lightMode, setLightMode] = useState(true)


  useEffect(() => {
    const fetchAPI = async () => {
      axios.get(`https://6253bcc4327578bba6413854.mockapi.io/api/job`)
        .then((response) => {
          setAPIData(response.data)
        })
    }
    fetchAPI()
  }, [refresh])

  // add
  const postData = async () => {
    await axios.post(`https://6253bcc4327578bba6413854.mockapi.io/api/job`, {
      job
    })
    setRefresh(!refresh)
  }

  //notify
  const notify = () => {
    setTimeout(() => {
      setNoti(false)
    }, 1000)
  }

  //add
  const handleAdd = e => {
    e.preventDefault()
    postData()
    setJob('')
    setNoti(true)
    notify()

  }

  //delete by id
  const handleDelete = (id) => {
    axios.delete(`https://6253bcc4327578bba6413854.mockapi.io/api/job/${id}`)
      .then(() => {
        getData()
      })
  }

  //get current information by read api
  const getData = () => {
    axios.get(`https://6253bcc4327578bba6413854.mockapi.io/api/job`)
      .then((getData) => {
        setAPIData(getData.data)
      })
  }

  //set current data
  const setData = (data) => {
    setID(data.id)
    setJob(data.job)
    setAppearUpdate(true)
  }

  //update api
  const updateData = async () => {
    console.log(id)
    await axios.put(`https://6253bcc4327578bba6413854.mockapi.io/api/job/${id}`, {
      job,
    })
    setRefresh(!refresh)
  }

  //handle update 
  const handleUpdate = e => {
    e.preventDefault()
    updateData()
    setJob('')
    setNoti(true)
    notify()
    setAppearUpdate(false)

  }

  // open confirm box
  const handleClickOpen = (removeid) => {
    setRemoveId(removeid)
    setAlertDialog(true)
  }

  // close confirm box
  const handleClose = () => {
    setAlertDialog(false);
  };

  //remove field by id
  const handleRemove = () => {
    handleDelete(removeId)
    handleClose()
  }

  // change mode
  const handleChangeMode = () => {
    setLightMode(!lightMode)
  }

  return (
    <div className="App" id={!lightMode && "darkModeApp"}>
      {noti && <Notify />}

      {alertDialog &&
        <div>
          <Dialog
            open={alertDialog}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Confirm removement"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to remove this ?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleRemove}>Remove</Button>
            </DialogActions>
          </Dialog>
        </div>
      }

      {/* when appearUpdate is True -> display the modal to input to update information */}
      {appearUpdate &&
        <div className="modal" id={!lightMode && "darkModeModal"}>
          <div className="updateForm">
            <div id="close_icon" onClick={() => setAppearUpdate(false)}>&times;</div>
            <form onSubmit={handleUpdate} className="form_edit">
              <label className="lable">Type things to update information</label><br />
              <input value={job} placeholder="Enter here" onChange={(e) => setJob(e.target.value)} required />
              <button className="btn">Update</button>
            </form>
          </div>
        </div>
      }


      <Grid container>
        <Grid item xs={12} md={12}>
          <div className="header">
            <div><h1 className="brand" id={!lightMode && "darkModeBrand"}>ThanhNM</h1></div>
            {lightMode ?
              <div className="Mode" onClick={handleChangeMode}>
                <NightlightIcon htmlColor="#0E185F" fontSize="large" />
              </div>
              :
              <div className="Mode" onClick={handleChangeMode}>
                <LightModeIcon htmlColor="#CFFFDC" fontSize="large" />
              </div>
            }
          </div>
          <div className="wrapper" id={!lightMode && "darkModeWrapper"}>
            <form onSubmit={handleAdd}>
              <label className="lable">Type things to add to todolist</label>
              <br />
              <input value={job} placeholder="Enter here" onChange={e => setJob(e.target.value)} required />
              <button className="btn">Add</button>
            </form>
            <div className="contain_job">
              {APIData.map((data, index) => (
                <div className="eachJob" key={index}>
                  <h2 className="job">{data.job}</h2>
                  <div className="action">
                    <h2 className="action_btn" onClick={() => setData(data)}>Edit</h2>
                    <h2 className="action_btn" onClick={() => handleClickOpen(data.id)}>&#10005;</h2>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </Grid>
      </Grid>
    </div>
  );
}

export default App;
