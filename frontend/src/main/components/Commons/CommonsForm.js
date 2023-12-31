import {Button, Form, Row, Col, OverlayTrigger, Tooltip} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {useBackend} from "main/utils/useBackend";

import HealthUpdateStrategiesDropdown from "main/components/Commons/HealthStrategiesUpdateDropdown";

function CommonsForm({initialCommons, submitAction, buttonLabel = "Create"}) {
    
    let modifiedCommons = initialCommons ? { ...initialCommons } : {};  // make a shallow copy of initialCommons
    
    // Stryker disable all
    const curr = new Date();
    const today = curr.toISOString().split('T')[0];
    
    if (modifiedCommons?.startingDate) {
        modifiedCommons.startingDate = modifiedCommons.startingDate.split("T")[0];
    }

    if (modifiedCommons?.lastDay) {
        modifiedCommons.lastDay = modifiedCommons.lastDay.split("T")[0];
    }

    const {
        register,
        formState: {errors},
        handleSubmit,
        getValues
    } = useForm(
        // modifiedCommons is guaranteed to be defined (initialCommons or {})
        {defaultValues: modifiedCommons}
    );
    // Stryker restore all

    const {data: healthUpdateStrategies} = useBackend(
        "/api/commons/all-health-update-strategies", {
            method: "GET",
            url: "/api/commons/all-health-update-strategies",
        },
    );

    const testid = "CommonsForm";
    // Stryker disable next-line all
    const defaultName = "";

    const defaultBelowStrategy = initialCommons?.belowCapacityStrategy || healthUpdateStrategies?.defaultBelowCapacity;
    const defaultAboveStrategy = initialCommons?.aboveCapacityStrategy || healthUpdateStrategies?.defaultAboveCapacity;

    return (
        <Form onSubmit={handleSubmit(submitAction)}>
            {initialCommons?.id ? 
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid={`${testid}-id`}
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialCommons.id}
                        disabled
                    />
                </Form.Group>
                :
                <span></span>
            }

            <div className="border-bottom mb-3"></div>

            <Row className="flex justify-content-start" style={{width: '80%'}} data-testid={`${testid}-r0`}>
                <Col className="" md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="name">Commons Name</Form.Label>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>This is the name farmers will see when joining the game.</Tooltip>}
                            delay='5'
                        >
                            <Form.Control
                                data-testid={`${testid}-name`}
                                id="name"
                                type="text"
                                defaultValue={defaultName}
                                isInvalid={!!errors.name}
                                {...register("name", {required: "Commons name is required"})}
                            />
                        </OverlayTrigger>
                        <Form.Control.Feedback type="invalid">
                            {errors.name?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    {initialCommons?.startingBalance && 
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="startingBalance">Starting Balance</Form.Label>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Each farmer starts with this amount of money in dollars.</Tooltip>}
                            delay='100'
                        >
                            <Form.Control
                                id="startingBalance"
                                data-testid={`${testid}-startingBalance`}
                                type="number"
                                step="0.01"
                                defaultValue={initialCommons.startingBalance}
                                isInvalid={!!errors.startingBalance}
                                {...register("startingBalance", {
                                    valueAsNumber: true,
                                    required: "Starting Balance is required",
                                    min: {value: 0.0, message: "Starting Balance must be ≥ 0.00"},
                                })}
                            />
                        </OverlayTrigger>
                        <Form.Control.Feedback type="invalid">
                            {errors.startingBalance?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    }
                </Col>
            </Row>

            <Row className="flex justify-content-start" style={{width: '80%'}} data-testid={`${testid}-r1`}>
                <Col md={6}>
                    {initialCommons?.cowPrice &&
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="cowPrice">Cow Price</Form.Label>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>This is the price to purchase cows. The selling price is this amount times the health of the cows on that farm.</Tooltip>}
                            delay='100'
                        >
                            <Form.Control
                                data-testid={`${testid}-cowPrice`}
                                id="cowPrice"
                                type="number"
                                step="0.01"
                                defaultValue={initialCommons.cowPrice}
                                isInvalid={!!errors.cowPrice}
                                {...register("cowPrice", {
                                    valueAsNumber: true,
                                    required: "Cow price is required",
                                    min: {value: 0.01, message: "Cow price must be ≥ 0.01"},
                                })}
                            />
                        </OverlayTrigger>


                        <Form.Control.Feedback type="invalid">
                            {errors.cowPrice?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    }
                </Col>
                <Col md={6}>
                    {initialCommons?.milkPrice &&
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="milkPrice">Milk Price</Form.Label>
                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip>This is the amount of money the farmer earns in profits for each cow every time it is milked if it is at 100% health. When a cow is at health less than 100%, the amount earned is multiplied by that percentage (e.g. 75% of the milk price if the health is at 75%).</Tooltip>}
                            delay='100'
                        >
                            <Form.Control
                                data-testid={`${testid}-milkPrice`}
                                id="milkPrice"
                                type="number"
                                step="0.01"
                                defaultValue={initialCommons.milkPrice}
                                isInvalid={!!errors.milkPrice}
                                {...register("milkPrice", {
                                    valueAsNumber: true,
                                    required: "Milk price is required",
                                    min: {value: 0.01, message: "Milk price must be ≥ 0.01"},
                                })}
                            />
                        </OverlayTrigger>
                        <Form.Control.Feedback type="invalid">
                            {errors.milkPrice?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    }
                </Col>
            </Row>

            <Row className="mt-1 flex justify-content-start" style={{width: '80%'}} data-testid={`${testid}-r2`}>
                <Col md={4}>
                    {initialCommons?.degradationRate &&
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="degradationRate">Degradation Rate</Form.Label>
                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip>This number controls the rate at which cow health decreases when the number of cows in the commons is greater than the effective carrying capacity. The way in which the number is used depends on the selected Health Update Formulas below.</Tooltip>}
                            delay='100'
                        >
                        <Form.Control
                            data-testid={`${testid}-degradationRate`}
                            id="degradationRate"
                            type="number"
                            step="0.0001"
                            defaultValue={initialCommons.degradationRate}
                            isInvalid={!!errors.degradationRate}
                            {...register("degradationRate", {
                                valueAsNumber: true,
                                required: "Degradation rate is required",
                                min: {value: 0, message: "Degradation rate must be ≥ 0"},
                            })}
                        />
                        </OverlayTrigger>
                        <Form.Control.Feedback type="invalid">
                            {errors.degradationRate?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    }
                </Col>
                <Col md={4}>
                    {initialCommons?.carryingCapacity &&
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="carryingCapacity">Carrying Capacity</Form.Label>
                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip>This is the minimum carrying capacity for the commons; at least this many cows may graze in the commons regardless of the number of players. If this number is zero, then only the Capacity Per User is used to determine the actual carrying capacity.</Tooltip>}
                            delay='100'
                        >
                        <Form.Control
                            data-testid={`${testid}-carryingCapacity`}
                            id="carryingCapacity"
                            type="number"
                            step="1"
                            defaultValue={initialCommons.carryingCapacity}
                            isInvalid={!!errors.carryingCapacity}
                            {...register("carryingCapacity", {
                                valueAsNumber: true,
                                required: "Carrying capacity is required",
                                min: {value: 1, message: "Carrying Capacity must be ≥ 1"},
                            })}
                        />
                        </OverlayTrigger>
                        <Form.Control.Feedback type="invalid">
                            {errors.carryingCapacity?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    }
                </Col>
                <Col md={4}>
                    {initialCommons?.capacityPerUser &&
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="capacityPerUser">Capacity Per User</Form.Label>
                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip>When this number is greater than zero, the commons will be able to support at least this many cows per farmer; that is, the effective carrying capacity of the commons is the value of Carrying Capacity, or Capacity Per User times the number of Farmers, whichever is greater. If this number is zero, then the Carrying Capacity is fixed regardless of the number of users.</Tooltip>}
                            delay='100'
                        >
                        <Form.Control
                            data-testid={`${testid}-capacityPerUser`}
                            id="capacityPerUser"
                            type="number"
                            step="1"
                            defaultValue={initialCommons.capacityPerUser}
                            isInvalid={!!errors.capacityPerUser}
                            {...register("capacityPerUser", {
                                valueAsNumber: true,
                                required: "Capacity Per User is required",
                            })}
                        />
                        </OverlayTrigger>
                        <Form.Control.Feedback type="invalid">
                            {errors.capacityPerUser?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    }
                </Col>
            </Row>
            
            <Row>
            {initialCommons?.startingDate ?
            // Stryker disable next-line all
            <Form.Group className="mb-5" style={{width: '300px', height: '50px'}} data-testid={`${testid}-r3`}>
                <Form.Label htmlFor="startingDate">Starting Date</Form.Label>
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>This is the starting date of the game; before this date, the jobs to calculate statistics, milk the cows, and report profits, etc. will not be run on this commons.</Tooltip>}
                    delay='100'
                >
                <Form.Control
                    // Stryker disable next-line all
                    data-testid={`${testid}-startingDate`}
                    id="startingDate"
                    type="date"
                    defaultValue={initialCommons.startingDate}
                    isInvalid={!!errors.startingDate}
                    {...register("startingDate", {
                        valueAsDate: true,
                        validate: {
                            isPresent: (v) => !isNaN(v) || "Start date is required" , 
                            // Stryker disable next-line all
                            crossVal: () => Number(getValues("startingDate")) <= Number(getValues("lastDay")) || "Start date must be on or before last day"}, 
                
                    })}
                />
                </OverlayTrigger>
                <Form.Control.Feedback type="invalid">
                    {errors.startingDate?.message}
                </Form.Control.Feedback>
            </Form.Group>
            :
            // Stryker disable next-line all
            <Form.Group className="mb-5" style={{width: '300px', height: '50px'}} data-testid={`${testid}-r3`}>
            <Form.Label htmlFor="startingDate">Starting Date</Form.Label>
            <OverlayTrigger
                placement="top"
                overlay={<Tooltip>This is the starting date of the game; before this date, the jobs to calculate statistics, milk the cows, and report profits, etc. will not be run on this commons.</Tooltip>}
                delay='100'
            >
            <Form.Control
                // Stryker disable next-line all
                data-testid={`${testid}-startingDate`}
                id="startingDate"
                type="date"
                defaultValue={today}
                // Stryker disable next-line all
                isInvalid={!!errors.startingDate}
                {...register("startingDate", {
                    valueAsDate: true,
                    // Stryker disable next-line all
                    validate: {isPresent: (v) => !isNaN(v)},
                })}
            />
            </OverlayTrigger>
            <Form.Control.Feedback type="invalid">
                {errors.startingDate?.message}
            </Form.Control.Feedback>
            </Form.Group>
            }
            {
            // Stryker disable next-line all
            <Form.Group className="mb-5" style={{width: '300px', height: '50px'}} data-testid={`${testid}-r4`}>
                <Form.Label htmlFor="lastDay">Last Day</Form.Label>
                <Form.Control
                    data-testid={`${testid}-lastDay`}
                    id="lastDay"
                    type="date"
                    defaultValue={today}
                    // Stryker disable next-line all
                    isInvalid={!!errors.lastDay}
                    {...register("lastDay", { 
                        valueAsDate: true,
                        validate: {
                            isPresent: (v) => !isNaN(v) || "Last Day is required"  
                        },
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.lastDay?.message}
                </Form.Control.Feedback>
            </Form.Group>}
            </Row>


            <h5>Health update formula</h5>
            <div className="border-bottom mb-4"></div>
            <Row>
                <Col md={6}>
                    <HealthUpdateStrategiesDropdown
                        formName={"aboveCapacityHealthUpdateStrategy"}
                        displayName={"When above capacity"}
                        initialValue={defaultAboveStrategy}
                        register={register}
                        healthUpdateStrategies={healthUpdateStrategies}
                    />

                </Col>
                <Col md={6}>
                    <HealthUpdateStrategiesDropdown
                        formName={"belowCapacityHealthUpdateStrategy"}
                        displayName={"When below capacity"}
                        initialValue={defaultBelowStrategy}
                        register={register}
                        healthUpdateStrategies={healthUpdateStrategies}
                    />
                </Col>
            </Row>

            {initialCommons?.showLeaderboard ?
            <Form.Group className="mb-3">
                <Form.Label htmlFor="showLeaderboard">Show Leaderboard?</Form.Label>
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>When checked, regular users will have access to the leaderboard for this commons. When unchecked, only admins can see the leaderboard for this commons.</Tooltip>}
                    delay='100'
                >
                <Form.Check
                    // Stryker disable next-line all
                    data-testid={`${testid}-showLeaderboard`}
                    type="checkbox"
                    id="showLeaderboard"
                    defaultChecked={initialCommons.showLeaderboard}
                    {...register("showLeaderboard")}
                />
                </OverlayTrigger>
            </Form.Group>
            :
            <Form.Group className="mb-3">
                <Form.Label htmlFor="showLeaderboard">Show Leaderboard?</Form.Label>
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>When checked, regular users will have access to the leaderboard for this commons. When unchecked, only admins can see the leaderboard for this commons.</Tooltip>}
                    delay='100'
                >
                <Form.Check
                    // Stryker disable next-line all
                    data-testid={`${testid}-showLeaderboard`}
                    type="checkbox"
                    id="showLeaderboard"
                    defaultChecked={false}
                    {...register("showLeaderboard")}
                />
                </OverlayTrigger>
            </Form.Group>            
            }

            <Row className="mb-5">
                <Button type="submit"
                        data-testid="CommonsForm-Submit-Button"
                        className="pl-1 w-30 text-left"
                        style={{width: '30%'}}
                >{buttonLabel}</Button>
            </Row>
        </Form>
    );
}
export default CommonsForm;