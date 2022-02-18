/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiAcc, apiCandidate } from '../../../api/apiConnect';
import StaffInfoView from '../../views/AccountManage/StaffInfoView';

function StaffInfo() {
    const { id } = useParams();
    const token = sessionStorage.getItem('token');
    const [staff, setStaff] = useState({});
    const [addFailed, setAddFailed] = useState(false);
    const [addSuccess, setAddSuccess] = useState(false);
    //GET STAFF
    const getStaffWithId = () => {
        apiAcc
            .get(`/accounts/${id}`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setStaff(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    useEffect(() => {
        getStaffWithId();
    }, []);
    //GET ROLE NOT IN USER
    const [roles, setRoles] = useState([]);
    const getRoleNotInUser = () => {
        apiAcc
            .get(`/accounts/list/notrole/${id}`, {
                headers: {
                    authorization: 'Bearer ' + token,
                },
            })
            .then((res) => {
                setRoles(res.data);
            })
            .catch((err) => console.log(err));
    };
    useEffect(() => {
        getRoleNotInUser();
    }, []);
    //GET ROLE HAVE IN USER
    const [roleInUser, setRoleInUser] = useState([]);
    const getRoleHaveInUser = () => {
        apiAcc
            .get(`/accounts/list/haverole/${id}`, {
                headers: {
                    authorization: 'Bearer ' + token,
                },
            })
            .then((res) => {
                setRoleInUser(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    useEffect(() => {
        getRoleHaveInUser();
    }, []);

    //GET PER IN USER
    const [perInUser, setPerInUser] = useState([]);
    const getPerInUser = () => {
        apiAcc
            .get(`/accounts/list/havePer/${id}`, {
                headers: {
                    authorization: 'Bearer ' + token,
                },
            })
            .then((res) => {
                setPerInUser(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    useEffect(() => {
        getPerInUser();
    }, []);
    //GET PER NOT IN USER
    const [permissions, setPermissions] = useState([]);
    const getPerNotInUser = () => {
        apiAcc
            .get(`/accounts/list/notPer/${id}`, {
                headers: {
                    authorization: 'Bearer ' + token,
                },
            })
            .then((res) => {
                setPermissions(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    useEffect(() => {
        getPerNotInUser();
    }, []);
    // POST UPDATE STAFF INFO
    const [canEdit, setCanEdit] = useState(false);
    const postUpdateStaff = (value) => {
        apiAcc
            .put('/accounts', value, {
                headers: {
                    authorization: 'Bearer ' + token,
                },
            })
            .then((res) => {
                getStaffWithId();
                setAddSuccess(true);
                setCanEdit(false);
            })
            .catch((err) => {
                console.log(err);
                setAddFailed(true);
            });
    };
    // POST ADD ROLE To USER
    const postAddRoleToUser = (value) => {
        const req = {
            roleId: value,
            username: staff.username,
        };
        apiAcc
            .post('/accounts/role/addtoaccounts', req, {
                headers: {
                    authorization: 'Bearer ' + token,
                },
            })
            .then((res) => {
                setAddSuccess(true);
                getRoleHaveInUser();
                getRoleNotInUser();
            })
            .catch((err) => {
                console.log(err);
                setAddFailed(true);
            });
    };
    // DELETE USER ROLE
    const deleteUserRole = (value) => {
        apiAcc
            .delete('/accounts/role/deleteroleaccount', {
                headers: {
                    authorization: 'Bearer ' + token,
                },
                data: { roleId: value, username: staff.username },
            })
            .then((res) => {
                setAddSuccess(true);
                getRoleHaveInUser();
                getRoleNotInUser();
            })
            .catch((err) => {
                console.log(err);
                setAddFailed(true);
            });
    };
    //POST ADD PERMISSION TO USER
    const [showAddPer, setShowAddPer] = useState(false);
    const toggleAddPer = () => {
        setShowAddPer(!showAddPer);
    };
    const [perId, setPerId] = useState('');
    const postAddPerToUser = (value) => {
        const request = {
            permissions_id: perId,
            canRead: value.canRead,
            canUpdate: value.canUpdate,
            canCreate: value.canCreate,
            account_id: staff.id,
        };
        // console.log(request);
        apiAcc
            .post('/accounts/permission/addtoaccounts', request, {
                headers: {
                    authorization: 'Bearer ' + token,
                },
            })
            .then((res) => {
                setAddSuccess(true);
                toggleAddPer();
                getPerInUser();
                getPerNotInUser();
            })
            .catch((err) => {
                console.log(err);
                setAddFailed(true);
            });
    };
    //DELETE USER PERMISSION
    const deleteUserPer = (value) => {
        apiAcc
            .delete('/accounts/permission/deletepermissionaccount', {
                headers: {
                    authorization: 'Bearer ' + token,
                },
                data: { roleId: value, username: staff.username },
            })
            .then((res) => {
                setAddSuccess(true);
                getPerInUser();
                getPerNotInUser();
            })
            .catch((err) => {
                console.log(err);
                setAddFailed(true);
            });
    };
    // CHANGE PASS FOR USER (only ADMIN)
    const [showModalPass, setShowModalPass] = useState(false);
    const toggleModalPassChange = () => {
        setShowModalPass(!showModalPass);
    };
    const postNewPass = (value) => {
        const request = {
            username: staff.username,
            password: value,
        };
        console.log(request);
        apiAcc
            .put('/accounts/admin/changepass', request, {
                headers: { 
                    authorization: 'Bearer ' + token 
                },
            })
            .then(res => {
                setAddSuccess(true);
                toggleModalPassChange()
            })
            .catch((err) => {
                console.log(err);
                setAddFailed(true);
            });
    };
    if (staff) {
        return (
            <StaffInfoView
                staff={staff}
                addFailed={addFailed}
                setAddFailed={setAddFailed}
                addSuccess={addSuccess}
                setAddSuccess={setAddSuccess}
                roles={roles}
                postUpdateStaff={postUpdateStaff}
                canEdit={canEdit}
                setCanEdit={setCanEdit}
                roleInUser={roleInUser}
                postAddRoleToUser={postAddRoleToUser}
                deleteUserRole={deleteUserRole}
                permissions={permissions}
                perInUser={perInUser}
                showAddPer={showAddPer}
                toggleAddPer={toggleAddPer}
                postAddPerToUser={postAddPerToUser}
                setPerId={setPerId}
                deleteUserPer={deleteUserPer}
                showModalPass={showModalPass}
                toggleModalPassChange={toggleModalPassChange}
                postNewPass={postNewPass}
            />
        );
    } else return <div></div>;
}
export default StaffInfo;
