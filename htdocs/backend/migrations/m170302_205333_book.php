<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205333_book extends Migration
{

    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $tableOptions = 'ENGINE=InnoDB';

        $this->createTable(
            '{{%book}}',
            [
                'id'=> $this->primaryKey(11),
                'item_number'=> $this->integer(11)->null()->defaultValue(null),
                'rights_film_id'=> $this->integer(11)->null()->defaultValue(null),
                'rights_film_bought_id'=> $this->integer(11)->null()->defaultValue(null),
                'rights_audio_id'=> $this->integer(11)->null()->defaultValue(null),
                'rights_audio_bought_id'=> $this->integer(11)->null()->defaultValue(null),
                'rights_tv_id'=> $this->integer(11)->null()->defaultValue(null),
                'rights_tv_bought_id'=> $this->integer(11)->null()->defaultValue(null),
                'publisher_id'=> $this->integer(11)->null()->defaultValue(null),
                'country_id'=> $this->integer(11)->null()->defaultValue(null),
                'origin_comment'=> $this->string(140)->null()->defaultValue(null),
                'rights_owner_id'=> $this->integer(11)->null()->defaultValue(null),
                'recommendation_id'=> $this->integer(11)->null()->defaultValue(null),
                'categories_tree'=> $this->string(100)->null()->defaultValue(null),
                'category_id'=> $this->integer(11)->null()->defaultValue(null),
                'author_id'=> $this->integer(11)->null()->defaultValue(null),
                'title'=> $this->string(512)->null()->defaultValue(null),
                'excerpt'=> $this->string(140)->null()->defaultValue(null),
                'body'=> $this->text()->null()->defaultValue(null),
                'ysk'=> $this->text()->null()->defaultValue(null)->comment('You should know'),
                'notes'=> $this->text()->null()->defaultValue(null),
                'recommendation_note'=> $this->string(140)->null()->defaultValue(null),
                'literary'=> $this->integer(11)->null()->defaultValue(0),
                'readability'=> $this->integer(11)->null()->defaultValue(0),
                'vibe'=> $this->string(140)->null()->defaultValue(null),
                'filmic'=> $this->string(140)->null()->defaultValue(null),
                'lenght'=> $this->string(140)->null()->defaultValue(null),
                'negatives'=> $this->string(140)->null()->defaultValue(null),
                'market'=> $this->string(140)->null()->defaultValue(null),
                'all_can_see'=> $this->smallInteger(6)->null()->defaultValue(null),
                'official_submission'=> $this->smallInteger(6)->null()->defaultValue(null),
                'slug'=> $this->string(1024)->null()->defaultValue(null),
                'view'=> $this->string(255)->null()->defaultValue(null),
                'thumbnail_base_url'=> $this->string(1024)->null()->defaultValue(null),
                'manuscript_base_url'=> $this->string(1024)->null()->defaultValue(null),
                'thumbnail_path'=> $this->string(1024)->null()->defaultValue(null),
                'manuscript_path'=> $this->string(1024)->null()->defaultValue(null),
                'status'=> $this->smallInteger(6)->null()->defaultValue(0),
                'created_by'=> $this->integer(11)->null()->defaultValue(null),
                'report_by'=> $this->integer(11)->null()->defaultValue(null),
                'updated_by'=> $this->integer(11)->null()->defaultValue(null),
                'published_at'=> $this->integer(11)->null()->defaultValue(null),
                'created_at'=> $this->integer(11)->null()->defaultValue(null),
                'updated_at'=> $this->integer(11)->null()->defaultValue(null),
                'counter'=> $this->integer(11)->null()->defaultValue(0),
                'rating'=> $this->integer(11)->null()->defaultValue(0),
            ],$tableOptions
        );
        $this->createIndex('fk_book_updater','{{%book}}','updated_by',false);
        $this->createIndex('fk_book_category','{{%book}}','categories_tree',false);
        $this->createIndex('fk_book_user','{{%book}}','created_by',false);
        $this->createIndex('fk_book_author','{{%book}}','author_id',false);
        $this->createIndex('fk_publisher_id','{{%book}}','publisher_id',false);
        $this->createIndex('fk_rights_owner_id','{{%book}}','rights_owner_id',false);
        $this->createIndex('fk_book_recomendation','{{%book}}','recommendation_id',false);
    }

    public function safeDown()
    {
        $this->dropIndex('fk_book_updater', '{{%book}}');
        $this->dropIndex('fk_book_category', '{{%book}}');
        $this->dropIndex('fk_book_user', '{{%book}}');
        $this->dropIndex('fk_book_author', '{{%book}}');
        $this->dropIndex('fk_publisher_id', '{{%book}}');
        $this->dropIndex('fk_rights_owner_id', '{{%book}}');
        $this->dropIndex('fk_book_recomendation', '{{%book}}');
        $this->dropTable('{{%book}}');
    }
}
