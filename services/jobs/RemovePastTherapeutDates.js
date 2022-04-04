const User = require('../../models/userModel')

// TODO: UPDATE TO MATCH NEW BOOKING LOGIC (MULTIPLE)
const RemovePastTherapeutAvailableDates = async () => {
    try {
        const therapeuts = await User.find({ role: 'therapeut' })
        if (!therapeuts) return

        therapeuts.forEach(therapeut => {
            if (therapeut.availableBookingDates.length > 0) {
                console.log('job: clearing expiring available dates...')
                const updatedAvailableBookingDates = therapeut.availableBookingDates.filter(date => {
                    return new Date(date.date).toLocaleDateString() >= new Date().toLocaleDateString()
                })

                therapeut.availableBookingDates = updatedAvailableBookingDates
                therapeut.save({ validateBeforeSave: false })
            }
        })
    } catch (e) {
        if (e) console.log(e)
    }
}

module.exports = RemovePastTherapeutAvailableDates