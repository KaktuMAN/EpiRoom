import { Activity } from "@customTypes/activity";
import { Room } from "@customTypes/room"
import { Town } from "@customTypes/town"

/**
 * Store data from API response in room object
 * @param rooms
 * @param activity
 * @param roomsNames
 */
function storeDataMultipleRooms(rooms: Room[], activity: Activity, roomsNames: string[]): void {
  roomsNames.forEach((roomName) => {
    let room = rooms.find((room) => room.intra_name === roomName)
    if (!room) {
      console.error(`Room ${roomName} not found in rooms list.`);
      return;
    }
    if (room.activities.find((activity) => activity.id === activity.id)) return;
    room.activities.push(activity)
    room.activities.sort((a, b) => a.start.getTime() - b.start.getTime())
  })
}

/**
 * Fetch data from API and store it in townData object
 * @param townData
 * @param setLoading
 * @param setError
 */
export default function fetchApiData(townData: Town, setLoading: (loading: boolean) => void, setError: (error: boolean) => void): void {
  const apiData = fetch(`https://lille-epirooms.epitest.eu/?date=${new Date().toISOString().slice(0, 10)}`)
    .then((response) => {
      if (response.ok)
        return response.json()
      else
        throw new Error("Unexcepted return status requesting epirooms data.");
    }).catch((error) => {
      console.error(`API REQUEST FAILED: ${error}`)
      setError(true)
      setLoading(false)
    })

  let newRooms = townData.rooms

  apiData.then((data: APIResponse[]) => {
    if (!data) return;
    setError(false)
    data.forEach((activityData: APIResponse) => {
      if (!activityData.room) return;
      let room = newRooms.find((room) => room.intra_name === activityData.room);
      let activity: Activity = {title: "", start: new Date(), end: new Date(), id: -1, active: false}
      
      activity.title = activityData.title?.replace("Réservation salle MSc - ", "")
      activity.start = new Date(activityData.start * 1000)
      activity.start = new Date(activity.start.getTime() + activity.start.getTimezoneOffset() * 60000)
      activity.end = new Date(activityData.end * 1000)
      activity.end = new Date(activity.end.getTime() + activity.end.getTimezoneOffset() * 60000)
      
      activity.id = activityData.event_id;

      if (activity.end.getTime() < new Date().getTime()) return;

      if (room === undefined) {
        let found = false;
        townData.multipleRooms.forEach((multipleRooms) => {
          if (multipleRooms.room === activityData.room) {
            found = true;
            storeDataMultipleRooms(newRooms, activity, multipleRooms.linkedRooms)
          }
        })
        if (found) return;
      }

      if (!room) {
        console.warn(`Room ${activityData.room} not found in rooms list.`);
        return;
      } else if (room && room.no_status !== true) {
        room.activities.push(activity)
        room.activities.sort((a, b) => a.start.getTime() - b.start.getTime())
        room.activities = room.activities.filter((activity, index, self) => index === self.findIndex((t) => (t.id === activity.id)))
      }
    })
    townData.rooms = newRooms
    setLoading(false)
  })
}