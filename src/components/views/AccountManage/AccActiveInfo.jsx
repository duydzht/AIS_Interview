/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { apiAcc } from "../../../api/apiConnect";
import AddFailed from "../Modal/AddFailed";
import AddSuccess from "../Modal/AddSuccess";
import Box from "@mui/material/Box";
import TextFieldInfor from "../../../helper/TextFieldInfor";
import { toastFail, toastSuccess } from "../../../helper/Notification/utils";
import { ToastContainer } from "react-toastify";
// import from ''

export default function AccActiveInfo() {
  const token = sessionStorage.getItem("token");
  const id = sessionStorage.getItem("id");
  const [info, setInfo] = useState('');
  //Modal Notifications
  const [addFailed, setAddFailed] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  const [show, setShow] = useState(false);
  const toggleModalChangePass = () => {
    setShow(!show);
  };

  const getAccount = () => {
    apiAcc
      .get(`/accounts/${id}`, {
        headers: {
          authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setInfo(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getAccount();
  }, []);
  // POST CHANGE PASS
  const [password, setPassword] = useState({
    username: sessionStorage.getItem("username"),
    oldPass: "",
    newPass: "",
    reNewPass: "",
  });

  const [err, setErr] = useState({
    match: false,
    minLength: false,
  });
  const validateForm = (e) => {
    e.preventDefault();
    if (password.newPass.length < 6) {
      setErr({ ...err, minLength: true });
      setTimeout(() => {
        setErr({ ...err, minLength: false });
      }, 4000);
      return;
    } else if (password.newPass !== password.reNewPass) {
      setErr({ ...err, match: true });
      setTimeout(() => {
        setErr({ ...err, match: false });
      }, 4000);
      return;
    } else {
      postChangePass();
      return;
    }
  };

  const postChangePass = (e) => {
    apiAcc
      .put("/accounts/changepass", password, {
        headers: {
          authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        toastSuccess('?????i m???t kh???u th??nh c??ng');
        signOut()
      })
      .catch((err) => {
        console.log(err);
        toastFail('Th???t b???i, vui l??ng th??? l???i')
      });
  };

  //Sign out
  const navigate = useNavigate();
  const signOut = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("company");
    sessionStorage.removeItem("id");
    navigate("/");
    window.location.reload();
  };
  return (
    <div>
      <div>
        <div className="title-field">
          <div className="text-left">Th??ng tin t??i kho???n</div>
        </div>
        <div className="card-information-user">
          <Box
            sx={{
              "& .MuiTextField-root": { m: 1, width: "75ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <div className="p-4">
              <div className="row">
                <div className="col-6">
                  <TextFieldInfor title="H??? v?? t??n" value={info?.fullName} />
                  <TextFieldInfor title="Email" value={info?.email} />
                  <TextFieldInfor title="?????a ch???" value={info?.address} />
                  <TextFieldInfor
                    title="V??? tr?? "
                    value={info.userType === null ? "(Tr???ng)" : info.userType}
                  />
                  <TextFieldInfor
                    title="T??n ????ng nh???p"
                    value={info?.username}
                  />
                  <TextFieldInfor title="M???t kh???u" value="**********" />
                  <div>
                    <div className="py-4">
                      <button
                        onClick={toggleModalChangePass}
                        className="button-user"
                      >
                        ?????i m???t kh???u
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-6 pt-5">
                  <div className="avatar-user m-auto">
                    <b className="name-in-avatar">
                      {info !== '' ? info.fullName.substr(0, 2) : ''}
                    </b>
                  </div>
                  <div>
                    <div className="py-5">
                      <button className="button-user">Ch???n ???nh</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </div>
      </div>
      <ToastContainer />
      {/* MODAL CHANGE PASS */}
      <Modal centered show={show} onHide={toggleModalChangePass}>
        <Modal.Header>
          <b className="change-password">?????i m???t kh???u</b>
          <button onClick={toggleModalChangePass} className="btn">
            <i className="fa fa-times fa-2x"></i>
          </button>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={validateForm}>
            <div className="form-group">
              <label>Old Password</label>
              <input
                type="password"
                className="form-control"
                value={password.oldPass}
                onChange={(e) => {
                  setPassword({
                    ...password,
                    oldPass: e.target.value,
                  });
                }}
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                className="form-control"
                value={password.newPass}
                onChange={(e) => {
                  setPassword({
                    ...password,
                    newPass: e.target.value,
                  });
                }}
              />
              {err.minLength === true ? (
                <span className="text-danger">
                  Password must be 6 or more characters!
                </span>
              ) : (
                ""
              )}
            </div>
            <div className="form-group">
              <label>Re-enter Password</label>
              <input
                type="password"
                className="form-control"
                value={password.reNewPass}
                onChange={(e) => {
                  setPassword({
                    ...password,
                    reNewPass: e.target.value,
                  });
                }}
              />
              {err.match === true ? (
                <span className="text-danger">
                  New password does not match!
                </span>
              ) : (
                ""
              )}
            </div>
            <div className="row">
              <div className="col-9"></div>
              <button type="submit" className="col-2 button-user px-4">
                L??u
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <AddSuccess addSuccess={addSuccess} setAddSuccess={setAddSuccess} />
      <AddFailed addFailed={addFailed} setAddFailed={setAddFailed} />
    </div>
  );
}
