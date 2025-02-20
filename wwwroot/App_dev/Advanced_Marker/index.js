async function initMap() {
    // Request needed libraries.
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const center = { lat: 37.43238031167444, lng: -122.16795397128632 };
    const map = new Map(document.getElementById("map"), {
        zoom: 11,
        center,
        mapId: "4504f8b37365c3d0",
    });

    for (const property of properties) {
        const AdvancedMarkerElement = new google.maps.marker.AdvancedMarkerElement({
            map,
            content: buildContent(property),
            position: property.position,
            title: property.description,
        });

        AdvancedMarkerElement.addListener("click", () => {
            toggleHighlight(AdvancedMarkerElement, property);
        });
    }
}

function toggleHighlight(markerView, property) {
    if (markerView.content.classList.contains("highlight")) {
        markerView.content.classList.remove("highlight");
        markerView.zIndex = null;
    } else {
        markerView.content.classList.add("highlight");
        markerView.zIndex = 1;
    }
}

function buildContent(property) {
    const content = document.createElement("div");

    content.classList.add("property");
    content.innerHTML = `
    <div class="icon" style="transform:rotate(30deg)">
    <!--<i aria-hidden="true" class="fa fa-icon fa-${property.type}" title="${property.type}"></i>
        <span class="fa-sr-only">${property.type}</span>-->
        <!--<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="30" height="30" fill="red" />
        </svg>-->

        <?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 width="50px" height="50px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve">
<g id="yellowcar">
	<path opacity="0.0" fill="#020202" enable-background="new    " d="M34.408,19.12c-0.139-3.959-0.436-7.038-0.652-8.861
		c-0.145-1.213-0.988-2.229-2.158-2.582c-1.324-0.4-3.277-0.815-5.669-0.816c-2.389,0-4.344,0.417-5.666,0.816
		c-1.172,0.354-2.016,1.369-2.162,2.582c-0.214,1.823-0.516,4.906-0.652,8.863c-0.391,0.056-1.081,0.223-1.448,0.712
		c-0.14,0.188,0.009,0.45,0.241,0.421l1.177-0.139c-0.027,1.047-0.042,2.146-0.044,3.295c0,6.833,0.741,15.271,1.1,18.929
		c0.108,1.123,0.957,2.033,2.072,2.219C21.848,44.775,23.735,45,25.93,45c2.193-0.002,4.082-0.225,5.385-0.441
		c1.115-0.186,1.963-1.096,2.072-2.219c0.355-3.658,1.1-12.096,1.1-18.929c0-1.146-0.016-2.25-0.045-3.294l1.178,0.14
		c0.232,0.027,0.381-0.234,0.242-0.422C35.486,19.342,34.797,19.176,34.408,19.12z"/>
	<g>
		<path fill="#FAA31F" d="M31.896,8.399c-0.143-1.211-0.99-2.229-2.158-2.581C28.416,5.418,26.461,5,24.07,5
			c-2.391,0.001-4.343,0.416-5.667,0.817c-1.169,0.354-2.016,1.37-2.159,2.581c-0.29,2.438-0.729,7.128-0.729,13.152
			c0,6.833,0.745,15.271,1.1,18.931c0.109,1.125,0.958,2.035,2.072,2.217c1.303,0.213,3.191,0.441,5.385,0.439
			c2.192-0.002,4.084-0.223,5.386-0.439c1.113-0.182,1.963-1.092,2.072-2.217c0.355-3.66,1.098-12.098,1.096-18.931
			C32.625,15.527,32.188,10.837,31.896,8.399z"/>
		<path fill="#FCE04C" d="M31.643,8.907c-0.139-1.174-0.959-2.156-2.088-2.498c-1.281-0.389-3.172-0.793-5.483-0.791
			c-2.312-0.001-4.202,0.402-5.484,0.792C17.457,6.75,16.641,7.733,16.5,8.907c-0.28,2.36,1.177,5.786,1.177,11.619
			c0,6.611,0.273,12.017,0.616,15.558c0.107,1.084-0.508,5.836,0.573,6.014c1.256,0.207,3.085,0.422,5.206,0.422
			c2.124,0.002,3.949-0.217,5.21-0.422c1.08-0.18,0.463-4.926,0.568-6.014c0.346-3.541,0.615-8.947,0.617-15.56
			C30.465,14.694,31.924,11.266,31.643,8.907z"/>
		<path fill="#FAA31F" d="M15.876,17.231c0,0-1.201,0.033-1.736,0.742c-0.14,0.188,0.008,0.451,0.243,0.422l1.493-0.174
			L15.876,17.231z"/>
		<path fill="#E9E8D8" d="M20.778,5.5c-0.928,0.155-1.729,0.352-2.377,0.55c-0.478,0.145-0.903,0.401-1.246,0.737
			c0.021,0.084,0.081,0.165,0.165,0.195c0.18,0.066,0.377-0.015,0.55-0.097c0.916-0.433,1.831-0.861,2.746-1.296
			C20.669,5.561,20.726,5.535,20.778,5.5z"/>
		<path fill="#FAA31F" d="M32.264,17.234c0,0,1.199,0.03,1.736,0.741c0.139,0.188-0.008,0.45-0.24,0.422l-1.494-0.176L32.264,17.234
			z"/>
		<path fill="#E9E8D8" d="M27.363,5.5c0.926,0.153,1.727,0.352,2.375,0.55c0.479,0.143,0.902,0.4,1.246,0.737
			c-0.021,0.083-0.082,0.165-0.162,0.194c-0.182,0.065-0.377-0.018-0.549-0.097c-0.918-0.433-1.834-0.864-2.748-1.297
			C27.47,5.563,27.415,5.534,27.363,5.5z"/>
		<g>
			<g>
				<g>
					<path fill="#484A4D" d="M18.291,36.086v5.523c0,0.449,0.329,0.828,0.771,0.898c1.768,0.279,5.01,0.328,5.01,0.328
						s3.244-0.045,5.009-0.328c0.441-0.07,0.768-0.451,0.77-0.898l-0.002-5.523H18.291z"/>
				</g>
				<g>
					<path fill="#484A4D" d="M24.069,9.471c-4.594,0-7.218,2.828-7.218,2.828l0.822,8.225c0,0,2.768-1.528,6.394-1.528
						c3.628,0,6.396,1.527,6.396,1.527l0.824-8.224C31.289,12.3,28.664,9.472,24.069,9.471z"/>
				</g>
			</g>
		</g>
		<path fill="#484A4D" d="M17.224,34.717c-0.017-1.986-0.036-4.25-0.055-6.357c-0.419-0.211-0.85-0.404-1.277-0.6
			c0.058,2.537,0.264,4.939,0.5,6.953h0.832V34.717z"/>
		<path fill="#484A4D" d="M16.46,35.307c0.38,3.049,0.804,5.072,0.804,5.072s-0.014-2.193-0.037-5.109
			C16.974,35.285,16.716,35.299,16.46,35.307z"/>
		<path fill="#484A4D" d="M17.158,27.527c-0.031-2.863-0.065-5.314-0.101-6.181c-0.101-2.57-0.822-7.093-0.822-7.093
			s-0.359,4.778-0.36,12.131c-0.001,0.01-0.001,0.021-0.001,0.029C16.286,26.805,16.715,27.174,17.158,27.527z"/>
		<path fill="#484A4D" d="M30.918,34.715c0.016-1.986,0.033-4.25,0.055-6.357c0.418-0.209,0.85-0.4,1.275-0.598
			c-0.059,2.533-0.264,4.939-0.502,6.953h-0.828V34.715z"/>
		<path fill="#484A4D" d="M31.678,35.307c-0.379,3.049-0.803,5.072-0.803,5.072s0.016-2.195,0.037-5.109
			C31.166,35.285,31.424,35.299,31.678,35.307z"/>
		<path fill="#484A4D" d="M30.98,27.527c0.029-2.864,0.066-5.315,0.102-6.182c0.102-2.57,0.82-7.093,0.82-7.093
			s0.363,4.779,0.363,12.132c-0.002,0.01,0,0.021-0.002,0.025C31.854,26.805,31.424,27.174,30.98,27.527z"/>
	</g>
</g>

        </svg>
    </div>
    <div class="details">
        <div class="price">${property.price}</div>
        <div class="address">${property.address}</div>
        <div class="features">
        <div>
            <i aria-hidden="true" class="fa fa-bed fa-lg bed" title="bedroom"></i>
            <span class="fa-sr-only">bedroom</span>
            <span>${property.bed}</span>
        </div>
        <div>
            <i aria-hidden="true" class="fa fa-bath fa-lg bath" title="bathroom"></i>
            <span class="fa-sr-only">bathroom</span>
            <span>${property.bath}</span>
        </div>
        <div>
            <i aria-hidden="true" class="fa fa-ruler fa-lg size" title="size"></i>
            <span class="fa-sr-only">size</span>
            <span>${property.size} ft<sup>2</sup></span>
        </div>
        </div>
    </div>
    `;
    return content;
}

const properties = [
    {
        address: "215 Emily St, MountainView, CA",
        description: "Single family house with modern design",
        price: "$ 3,889,000",
        type: "home",
        bed: 5,
        bath: 4.5,
        size: 300,
        position: {
            lat: 37.50024109655184,
            lng: -122.28528451834352,
        },
    },
    {
        address: "108 Squirrel Ln &#128063;, Menlo Park, CA",
        description: "Townhouse with friendly neighbors",
        price: "$ 3,050,000",
        type: "building",
        bed: 4,
        bath: 3,
        size: 200,
        position: {
            lat: 37.44440882321596,
            lng: -122.2160620727,
        },
    },
    {
        address: "100 Chris St, Portola Valley, CA",
        description: "Spacious warehouse great for small business",
        price: "$ 3,125,000",
        type: "warehouse",
        bed: 4,
        bath: 4,
        size: 800,
        position: {
            lat: 37.39561833718522,
            lng: -122.21855116258479,
        },
    },
    {
        address: "98 Aleh Ave, Palo Alto, CA",
        description: "A lovely store on busy road",
        price: "$ 4,225,000",
        type: "store-alt",
        bed: 2,
        bath: 1,
        size: 210,
        position: {
            lat: 37.423928529779644,
            lng: -122.1087629822001,
        },
    },
    {
        address: "2117 Su St, MountainView, CA",
        description: "Single family house near golf club",
        price: "$ 1,700,000",
        type: "home",
        bed: 4,
        bath: 3,
        size: 200,
        position: {
            lat: 37.40578635332598,
            lng: -122.15043378466069,
        },
    },
    {
        address: "197 Alicia Dr, Santa Clara, CA",
        description: "Multifloor large warehouse",
        price: "$ 5,000,000",
        type: "warehouse",
        bed: 5,
        bath: 4,
        size: 700,
        position: {
            lat: 37.36399747905774,
            lng: -122.10465384268522,
        },
    },
    {
        address: "700 Jose Ave, Sunnyvale, CA",
        description: "3 storey townhouse with 2 car garage",
        price: "$ 3,850,000",
        type: "building",
        bed: 4,
        bath: 4,
        size: 600,
        position: {
            lat: 37.38343706184458,
            lng: -122.02340436985183,
        },
    },
    {
        address: "868 Will Ct, Cupertino, CA",
        description: "Single family house in great school zone",
        price: "$ 2,500,000",
        type: "home",
        bed: 3,
        bath: 2,
        size: 100,
        position: {
            lat: 37.34576403052,
            lng: -122.04455090047453,
        },
    },
    {
        address: "655 Haylee St, Santa Clara, CA",
        description: "2 storey store with large storage room",
        price: "$ 2,500,000",
        type: "store-alt",
        bed: 3,
        bath: 2,
        size: 450,
        position: {
            lat: 37.362863347890716,
            lng: -121.97802139023555,
        },
    },
    {
        address: "2019 Natasha Dr, San Jose, CA",
        description: "Single family house",
        price: "$ 2,325,000",
        type: "home",
        bed: 4,
        bath: 3.5,
        size: 500,
        position: {
            lat: 37.41391636421949,
            lng: -121.94592071575907,
        },
    },
];

initMap();