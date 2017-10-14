<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205346_country extends Migration
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
            '{{%country}}',
            [
                'id'=> $this->primaryKey(11),
                'country_name'=> $this->string(100)->notNull()->defaultValue(''),
                'country_code'=> $this->string(2)->notNull()->defaultValue(''),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%country}}');
    }
}
