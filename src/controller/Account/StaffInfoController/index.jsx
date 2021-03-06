/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiAcc } from '../../../api/apiConnect';
import { toastFail, toastSuccess } from '../../../helper/Notification/utils';
import StaffInfoView from '../../../components/Account/StaffInfoComponent';

function StaffInfo() {
    const { id } = useParams();
    const token = sessionStorage.getItem('token');
    const [staff, setStaff] = useState({});
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
    const getAllRole = () => {
        apiAcc
            .get(`/accounts/role/list`, {
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
        getAllRole();
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
    // const [permissions, setPermissions] = useState([]);
    // const getPerNotInUser = () => {
    //     apiAcc
    //         .get(`/accounts/list/notPer/${id}`, {
    //             headers: {
    //                 authorization: 'Bearer ' + token,
    //             },
    //         })
    //         .then((res) => {
    //             setPermissions(res.data);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // };
    // useEffect(() => {
    //     getPerNotInUser();
    // }, []);
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
                toastSuccess('C???p nh???t th??ng tin th??nh c??ng');
                getStaffWithId();
                setCanEdit(false);
            })
            .catch((err) => {
                console.log(err);
                toastFail('Th???t b???i, vui l??ng ki???m tra l???i');
            });
    };
    // POST ADD ROLE To USER
    const postAddRoleToUser = (id) => {
        const req = {
            roleId: id,
            username: staff.username,
        };
        apiAcc
            .post('/accounts/role/addtoaccounts', req, {
                headers: {
                    authorization: 'Bearer ' + token,
                },
            })
            .then((res) => {
                toastSuccess('Th??m Role th??nh c??ng');
                getRoleHaveInUser();
                getAllRole();
            })
            .catch((err) => {
                console.log(err);
                toastFail('Th???t b???i, vui l??ng ki???m tra l???i');
            });
    };
    // DELETE USER ROLE
    const deleteUserRole = (id) => {
        apiAcc
            .delete('/accounts/role/deleteroleaccount', {
                headers: {
                    authorization: 'Bearer ' + token,
                },
                data: { roleId: id, username: staff.username },
            })
            .then((res) => {
                toastSuccess('X??a Role th??nh c??ng');
                getRoleHaveInUser();
                getAllRole();
            })
            .catch((err) => {
                console.log(err);
                toastFail('Th???t b???i, vui l??ng ki???m tra l???i');
            });
    };
    //POST ADD PERMISSION TO USER
    const [perId, setPerId] = useState('');
    const postAddPerToUser = (value) => {
        
        apiAcc
            .put('/accounts/permission/updatetouser', value, {
                headers: {
                    authorization: 'Bearer ' + token,
                },
            })
            .then((res) => {
                toastSuccess('Th??m Permission th??nh c??ng');
                getPerInUser();
            })
            .catch((err) => {
                console.log(err);
                toastFail('Th???t b???i, vui l??ng ki???m tra l???i');
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
                toastSuccess('???? x??a Permission th??nh c??ng');
                getPerInUser();
            })
            .catch((err) => {
                console.log(err);
                toastFail('Th???t b???i, vui l??ng ki???m tra l???i');
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
                toastSuccess('?????i m???t kh???u th??nh c??ng');
                toggleModalPassChange()
            })
            .catch((err) => {
                console.log(err);
                toastFail('Th???t b???i, vui l??ng ki???m tra l???i');
            });
    };
    if (staff) {
        return (
            <StaffInfoView
                staff={staff}
                roles={roles}
                postUpdateStaff={postUpdateStaff}
                canEdit={canEdit}
                setCanEdit={setCanEdit}
                roleInUser={roleInUser}
                postAddRoleToUser={postAddRoleToUser}
                deleteUserRole={deleteUserRole}
                perInUser={perInUser}
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
