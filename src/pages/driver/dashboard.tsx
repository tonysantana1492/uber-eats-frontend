import { useMutation, useSubscription } from '@apollo/client';
import GoogleMapReact from 'google-map-react';
import { graphql } from '../../gql';
import { useNavigate } from 'react-router-dom';
import { TakeOrderMutation } from '../../gql/graphql';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

const COOCKED_ORDERS_SUBSCRIPTION = graphql(`
	subscription coockedOrders {
		cookedOrders {
			...FullOrderParts
		}
	}
`);

const TAKE_ORDER_MUTATION = graphql(`
	mutation takeOrder($input: TakeOrderInput!) {
		takeOrder(input: $input) {
			ok
			error
		}
	}
`);

interface ICoords {
	lat: number;
	lng: number;
}

interface IDriverProps {
	lat: number;
	lng: number;
	$hover?: any;
}

const Driver: React.FC<IDriverProps> = () => <div className='text-lg'>🚖</div>;

export const Dashboard = () => {
	const navigate = useNavigate();
	const [driverCoords, setDriverCoords] = useState<ICoords>({ lng: 0, lat: 0 });
	const [map, setMap] = useState<google.maps.Map>();
	const [maps, setMaps] = useState<any>();

  const makeRoute = () => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: "#000",
          strokeOpacity: 1,
          strokeWeight: 5,
        },
      });
      directionsRenderer.setMap(map);
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(
              driverCoords.lat,
              driverCoords.lng
            ),
          },
          destination: {
            location: new google.maps.LatLng(
              driverCoords.lat + 0.05,
              driverCoords.lng + 0.05
            ),
          },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result) => {
          directionsRenderer.setDirections(result);
        }
      );
    }
  };
  
	const onCompleted = (data: TakeOrderMutation) => {
    if (data.takeOrder.ok) {
      navigate(`/orders/${coockedOrdersData?.cookedOrders.id}`);
		}
	};
  
	const [takeOrderMutation] = useMutation(TAKE_ORDER_MUTATION, { onCompleted });
  const { data: coockedOrdersData } = useSubscription(COOCKED_ORDERS_SUBSCRIPTION);
	
  const triggerMutation = (orderId: number) => {
		takeOrderMutation({
			variables: {
				input: {
					id: orderId,
				},
			},
		});
	};

  // Al cargar la api posicionar el centro del mapa en la posicion actual del repartidor
	const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
		map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
		setMap(map);
		setMaps(maps);
	};

	const onSuccess = ({ coords: { latitude, longitude } }: GeolocationPosition) => {
		setDriverCoords({ lat: latitude, lng: longitude });
	};

	const onError = (error: GeolocationPositionError) => {
		console.log(error);
	};

  // Obtener la posicion inicial del repartidor
	useEffect(() => {
		navigator.geolocation.watchPosition(onSuccess, onError, {
			enableHighAccuracy: true,
		});
	}, []);

  // Si cambia la posicion del repartidor representarla en el mapa
	useEffect(() => {
		if (map && maps) {
			map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
			/* const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
        },
        (results, status) => {
          console.log(status, results);
        }
      ); */
		}
	}, [driverCoords.lat, driverCoords.lng]);

  useEffect(() => {
    if (coockedOrdersData?.cookedOrders.id) {
      makeRoute();
    }
  }, [coockedOrdersData]);

	return (
		<div>
			<Helmet>
				<title>Dashboard | Uber Eats</title>
			</Helmet>
			<div className='overflow-hidden' style={{ width: window.innerWidth, height: '50vh' }}>
				<GoogleMapReact
					yesIWantToUseGoogleMapApiInternals
					onGoogleApiLoaded={onApiLoaded}
					defaultZoom={16}
					draggable={true}
					defaultCenter={{
						lat: 36.58,
						lng: 125.95,
					}}
					bootstrapURLKeys={{ key: 'AIzaSyDBoOMuQsFzQJJ-UAxEItgE3K3-JfH7opA' }}
				>
					<Driver lat={driverCoords.lat} lng={driverCoords.lng} />
				</GoogleMapReact>
			</div>
			<div className=' max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5'>
				{coockedOrdersData?.cookedOrders.restaurant ? (
					<>
						<h1 className='text-center  text-3xl font-medium'>New Coocked Order</h1>
						<h1 className='text-center my-3 text-2xl font-medium'>
							Pick it up soon @ {coockedOrdersData?.cookedOrders.restaurant?.name}
						</h1>
						<button
							onClick={() => triggerMutation(coockedOrdersData?.cookedOrders.id)}
							className='btn w-full  block  text-center mt-5'
						>
							Accept Challenge &rarr;
						</button>
					</>
				) : (
					<h1 className='text-center  text-3xl font-medium'>No orders yet...</h1>
				)}
			</div>
		</div>
	);
};
