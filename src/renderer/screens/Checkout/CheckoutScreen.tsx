import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { AppointmentModel } from "../../models/appointment.model";
import AppointmentItemScanner from "./AppointmentItemScanner";
import AppointmentList from "./AppointmentList";

function CheckoutScreen() {
    const today = useMemo(() => dayjs().startOf('d').toDate().toUTCString(), [])
    const [selected_appt, setSelectedAppt] = useState<AppointmentModel | undefined>()

    const onSelect = (appt: AppointmentModel) => {
        setSelectedAppt(appt)
    }

    return <div className='h-full flex item-stretch overflow-hidden'>
        <div className='w-1/3 border-r-2 shadow-lg p-4 overflow-y-auto'>
            <p className='text-md font-bold mb-2'>Appointments: {dayjs(today).format('MMM DD, YYYY')}</p>
            <AppointmentList date={today} onSelect={onSelect} selected={selected_appt} />
        </div>
        <div className='flex-1 p-4 relative'>
            <p className='text-md font-bold mb-2'>{selected_appt ? `${selected_appt.patient.first_name} (${selected_appt.id})` : 'Pick an appointment'}</p>
            {selected_appt ? <AppointmentItemScanner
                appointment_id={selected_appt.id}
                patient_name={selected_appt.patient.first_name}
            /> : null}
        </div>
    </div>
}

export default CheckoutScreen;
