<?php

//Model to get products
class ConnectionClass {

    private $master = array(
        "dbhost" => 'hostingmysql284.nominalia.com',
        "dbname" => 'nostrum_simply__webspace_es_web',
        "dbuser" => 'QSG1_novaweb',
        "dbpass" => 'BS0001'
    );
    private $local = array(
        "dbhost" => 'hostingmysql284.nominalia.com',
        "dbname" => 'nostrum_eu_test',
        "dbuser" => 'QSG1_test',
        "dbpass" => 'Boira_2014'
    );
    private $connection;

    public function SyncProducts($lang = 'es', $close = true) {
        
        $sync = array();
        
        $sync['products'] =  $this->getAllProducts($lang, $close);
        $sync['categories'] = $this->GetCategories($lang);
        $sync['tags'] = $this->GetSubcategories($lang);
        
        return $sync;
    }

    private function connectToMaster() {
        $con = $this->master;
        
        $options = array(
            PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
        );
        try {
            $this->masterconnection = new PDO("mysql:host=" . $con['dbhost'] . ";dbname=" . $con['dbname'] . "", $con['dbuser'], $con['dbpass'], $options);
            // set the PDO error mode to exception
            $this->masterconnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            echo "Connection failed: " . $e->getMessage();
        }
    }

    public function Insert($form) {

        $this->connectToMaster();

        $query = "INSERT INTO contact (Form , Timestamp , Language , Reference , Coordinates) "
        . " VALUES('".json_encode($form)."' , NOW() , '".$form['Candidature']['Language']."' ,"
        .  " '".$_SERVER['HTTP_REFERER'] . "' ,'".$form['Candidature']['Position']['latitude'] . ",". $form['Candidature']['Position']['longitude'] . "')";
        

        $prod = $this->masterconnection->prepare($query);
        

        return $prod->execute();;
    }

    public function Get($number , $page) {

        $this->connectToMaster();

        $offset = $number * ($page - 1 ) + 1;

        $query = "SELECT * FROM contact ORDER BY TIMESTAMP DESC LIMIT $number OFFSET $offset";
        $prod = $this->masterconnection->prepare($query);
        $prod->execute();
        $cat = $prod->fetchAll();

        return $cat;

    }


}

class Product {

    public $data;

    public function __construct($product) {

        $product = (object) $product;
        $this->data->text = $product->text;
        $this->data->id_lang = $product->id_lang;
        $this->data->denomination = $product->denomination;
        $this->data->description = $product->description;
        $this->data->ingredients = $product->ingredients;
        $this->data->codi = $product->codi;
        $this->data->url = $product->url;
        $this->data->pvp = $product->pvp;
        $this->data->pvpfans = $product->pvpfans;
        //$this->data->active = $product->active;
        $this->data->category = $product->category;
        $this->data->cal_100 = $product->cal_100;
        $this->data->cal_dish = $product->cal_dish;
        $this->data->carbohydrates_100 = $product->carbohydrates_100;
        $this->data->carbohydrates_dish = $product->carbohydrates_dish;
        $this->data->carbohydrates_sugars_100 = $product->carbohydrates_sugars_100;
        $this->data->carbohydrates_sugars_dish = $product->carbohydrates_sugars_dish;
        $this->data->proteins_100 = $product->proteins_100;
        $this->data->proteins_dish = $product->proteins_dish;
        $this->data->fibre_100 = $product->fibre_100;
        $this->data->fibre_dish = $product->fibre_dish;
        $this->data->salt_100 = $product->salt_100;
        $this->data->salt_dish = $product->salt_dish;
        $this->data->fats_100 = $product->fats_100;
        $this->data->fats_dish = $product->fats_dish;
        $this->data->satured_fats_100 = $product->satured_fats_100;
        $this->data->satured_fats_dish = $product->satured_fats_dish;
        $this->data->use_conditions = $product->use_conditions;
        $this->data->weight = $product->weight;
        $this->data->measure = $product->measure;
        $this->data->conservation = $product->conservation;
    }

}

?>