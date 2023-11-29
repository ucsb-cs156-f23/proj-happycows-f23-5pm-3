import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CommonsForm from "main/components/Commons/CommonsForm";
import { Navigate } from 'react-router-dom'
import { toast } from "react-toastify"

import { useBackend, useBackendMutation } from "main/utils/useBackend";

const AdminCreateCommonsPage = () => {

    // Stryker disable all 
    const { data: initialCommons } = useBackend(
        ["/api/commons/defaults"],
        { method: "GET", url: "/api/commons/defaults" },
        []
        );
    // Stryker restore all

    const objectToAxiosParams = (newCommons) => ({
        url: "/api/commons/new",
        method: "POST",
        data: newCommons
    });

    const onSuccess = (commons) => {
        toast(<div>Commons successfully created!
            <br />{`id: ${commons.id}`}
            <br />{`name: ${commons.name}`}
            <br />{`startingBalance: ${commons.startingBalance}`}
            <br />{`cowPrice: ${commons.cowPrice}`}
            <br />{`milkPrice: ${commons.milkPrice}`}
            <br />{`degradationRate: ${commons.degradationRate}`}
            <br />{`carryingCapacity: ${commons.carryingCapacity}`}
            <br />{`capacityPerUser: ${commons.capacityPerUser}`}
            <br />{`startDate: ${commons.startingDate}`}
            <br />{`aboveCapacityHealthUpdateStrategy: ${commons.aboveCapacityHealthUpdateStrategy}`}
            <br />{`belowCapacityHealthUpdateStrategy: ${commons.belowCapacityHealthUpdateStrategy}`}
            <br />{`showLeaderboard: ${commons.showLeaderboard}`}
        </div>);
    }
   
    // Stryker disable all
    const mutation = useBackendMutation(
        objectToAxiosParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        ["/api/commons/all"]
    );
    // Stryker restore all

    const submitAction = async (data) => {
        mutation.mutate(data);
    }


    if (mutation.isSuccess) {
        return <Navigate to="/" />
    }

    return (
        <BasicLayout>
            <h2>Create Commons</h2>
            <CommonsForm
                initialCommons={initialCommons}
                submitAction={submitAction}
            />
        </BasicLayout>
    );
};

export default AdminCreateCommonsPage;