<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_210714_book_deals extends Migration
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
            '{{%book_deals}}',
            [
                'id'=> $this->primaryKey(11),
                'book_id'=> $this->integer(11)->notNull()->defaultValue(0),
                'country_id'=> $this->integer(11)->notNull()->defaultValue(0),
                'contact_id'=> $this->integer(11)->notNull()->defaultValue(0),
                'deal_date'=> $this->integer(11)->notNull()->defaultValue(0),
            ],$tableOptions
        );
        $this->createIndex('fk_book_id','{{%book_deals}}','book_id',false);
        $this->createIndex('fk_contact_id','{{%book_deals}}','contact_id',false);
        $this->createIndex('fk_country_id','{{%book_deals}}','country_id',false);
    }

    public function safeDown()
    {
        $this->dropIndex('fk_book_id', '{{%book_deals}}');
        $this->dropIndex('fk_contact_id', '{{%book_deals}}');
        $this->dropIndex('fk_country_id', '{{%book_deals}}');
        $this->dropTable('{{%book_deals}}');
    }
}
