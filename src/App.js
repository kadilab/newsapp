import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardImg, CardBody, Input, Button, Modal, ModalBody } from 'reactstrap';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Logo from './logs.jpg';

const masonryBreakpoints = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};
const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // {setQuery = "arduino"}
  const searchImages = async () => {
    try {
      const response = await axios.get(`https://pixabay.com/api/?key=31534827-f9fcb98a8757f3b013c504882&q=${query}&image_type=photo`);
      setImages(response.data.hits);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    searchImages();
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const openModal = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setCurrentImageIndex(0);
  };

  const goToPreviousImage = () => {
    if (currentImageIndex > 0) {
      const previousIndex = currentImageIndex - 1;
      setSelectedImage(images[previousIndex]);
      setCurrentImageIndex(previousIndex);
    }
  };

  const goToNextImage = () => {
    if (currentImageIndex < images.length - 1) {
      const nextIndex = currentImageIndex + 1;
      setSelectedImage(images[nextIndex]);
      setCurrentImageIndex(nextIndex);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const backToTopButton = document.getElementById('backToTop');
      if (window.pageYOffset > 200) {
        backToTopButton.classList.add('show');
      } else {
        backToTopButton.classList.remove('show');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Container className="mt-4">
      {/* logo */}
      <Container className="d-flex justify-content-center">
          <img src={Logo} style={{width:"20%"}} className="logo" />
      </Container>    
      <Row>
        <Col>
        {/* formulaire de recherche */}
          <form onSubmit={handleSearch}>
            <Input
              type="text"
              placeholder="Recherchez des images..."
              value={query}
              onChange={handleInputChange}
              className="search-input"
              endAdornment={<SearchIcon className="search-icon" />}
            />
            {/* Bouton qui envoi la requette  */}
            <Button color="primary" type="submit" className="mt-2">
              Rechercher <SearchIcon />
            </Button>
          </form>
        </Col>
      </Row>
      <Row>
        <Col>
          <Masonry
            breakpointCols={masonryBreakpoints}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid-column"
          >
            {/* car qui affiche les differentes image sur la page */}
            {images.map((image, index) => (
              <Card key={image.id} className="mt-4 card"  onClick={() => openModal(image, index)}>
                <CardImg top src={image.webformatURL} alt={image.tags} />
                <CardBody className='card-body'>
                  <p className="text-center">{image.tags}</p>
                </CardBody>
              </Card>
            ))}
          </Masonry>
        </Col>
      </Row>
      {/* Bouton qui permet de remonter en haut de la page */}
      <button id="backToTop" onClick={scrollToTop} aria-label="Retour en haut de page">
        <ArrowUpwardIcon />
      </button>
      {/* affiche en grand de l'image clicker */}
      <Modal isOpen={selectedImage !== null} toggle={closeModal}>
        <ModalBody>
          {selectedImage && (
            <div>
              <img
                src={selectedImage.largeImageURL}
                alt={selectedImage.tags}
                className="img-fluid"
              />
              {/* Bouton qui permet de naviguer entre differentes images */}
              <div className="image-navigation">
                <Button color='primary' className="previous-image" onClick={goToPreviousImage}>
                  <ChevronLeftIcon />
                </Button>
                <Button color='primary' className="next-image" onClick={goToNextImage}>
                  <ChevronRightIcon />
                </Button>
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default App;
